// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract EduDotFun is ReentrancyGuard, AccessControl {

    // Libraries
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _sessionIds;

    // Constants
    uint8 private constant MIN_RATING = 1;
    uint8 private constant MAX_RATING = 5;
    uint256 private constant MINIMUM_SESSION_DURATION = 30 minutes;
    uint256 private constant SESSION_TIMEOUT = 24 hours;
    uint256 private constant BASE_TUTOR_SHARE_PERCENTAGE = 80; 
    uint256 private constant MAX_PLATFORM_FEE = 20;

    // Structs
    struct Tutor {
        string name;
        uint256 ratePerHour;
        bool isListed;
        uint256 totalSessions;
        uint256 totalRating;
        bool isVerified;
    }

    struct Session {
        address user;
        address tutor;
        uint256 amount;
        uint256 duration;
        uint256 startTime;
        uint256 bookedAt;
        SessionStatus status;
        uint8 rating;
    }

    enum SessionStatus {
        Booked,
        InProgress,
        Completed,
        Cancelled,
        Disputed,
        TimedOut
    }

    // Roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant TUTOR_ROLE = keccak256("TUTOR_ROLE");

    // State variables
    mapping(address => Tutor) public tutors;
    mapping(uint256 => Session) public sessions;
    mapping(address => uint256[]) public tutorSessions;
    mapping(address => uint256[]) public userSessions;

    uint256 public platformFee = 5;

    // Events
    event TutorCreated(address indexed tutor, string name, uint256 ratePerHour);
    event TutorRateUpdated(address indexed tutor, uint256 newRate);
    event TutorVerified(address indexed tutor);
    event SessionBooked(
        uint256 indexed sessionId,
        address indexed user,
        address indexed tutor,
        uint256 amount,
        uint256 duration
    );
    event SessionStarted(uint256 indexed sessionId, uint256 startTime);
    event SessionCompleted(uint256 indexed sessionId, uint8 rating);
    event SessionCancelled(uint256 indexed sessionId, string reason);
    event SessionDisputed(uint256 indexed sessionId);
    event SessionTimedOut(uint256 indexed sessionId);
    event PaymentProcessed(
        uint256 indexed sessionId,
        uint256 tutorShare,
        uint256 userRefund
    );

    constructor() {
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    // Modifiers
    modifier onlyTutor(uint256 _sessionId) {
        require(
            hasRole(TUTOR_ROLE, msg.sender),
            "Only tutors can perform this action"
        );
        require(
            sessions[_sessionId].tutor == msg.sender,
            "Only tutor can perform this action"
        );
        _;
    }

    modifier onlyStudent(uint256 _sessionId) {
        require(
            sessions[_sessionId].user == msg.sender,
            "Only student can perform this action"
        );
        _;
    }

    modifier validSession(uint256 _sessionId) {
        require(_sessionId < _sessionIds.current(), "Invalid session ID");
        _;
    }

    // Tutor Management Functions
    function createTutor(string memory _name, uint256 _ratePerHour) external {
        require(_ratePerHour > 0, "Rate must be greater than zero");
        require(!tutors[msg.sender].isListed, "Tutor already listed");

        tutors[msg.sender] = Tutor({
            name: _name,
            ratePerHour: _ratePerHour,
            isListed: true,
            totalSessions: 0,
            totalRating: 0,
            isVerified: false
        });

        _grantRole(TUTOR_ROLE, msg.sender);
        emit TutorCreated(msg.sender, _name, _ratePerHour);
    }

    function updateTutorRate(uint256 _newRate)
        external
    {
        require(_newRate > 0, "Rate must be greater than zero");
        require(tutors[msg.sender].isListed, "Tutor not listed");
        tutors[msg.sender].ratePerHour = _newRate;
        emit TutorRateUpdated(msg.sender, _newRate);
    }

    // Admin Functions
    function verifyTutor(address _tutor) external onlyRole(ADMIN_ROLE) {
        require(tutors[_tutor].isListed, "Tutor not listed");
        tutors[_tutor].isVerified = true;
        emit TutorVerified(_tutor);
    }

    function setPlatformFee(uint256 _newFee) external onlyRole(ADMIN_ROLE) {
        require(_newFee <= MAX_PLATFORM_FEE, "Fee cannot exceed 20%");
        platformFee = _newFee;
    }

    // Session Management Functions
    function bookSession(address _tutor, uint256 _duration)
        external
        payable
        nonReentrant
    {
        require(tutors[_tutor].isListed, "Tutor not listed");
        require(_duration >= MINIMUM_SESSION_DURATION, "Session too short");

        uint256 expectedAmount = (tutors[_tutor].ratePerHour * _duration) / 1 hours;
        require(msg.value == expectedAmount, "Incorrect payment amount");

        uint256 sessionId = _sessionIds.current();
        _sessionIds.increment();

        sessions[sessionId] = Session({
            user: msg.sender,
            tutor: _tutor,
            amount: msg.value,
            duration: _duration,
            startTime: 0,
            bookedAt: block.timestamp,
            status: SessionStatus.Booked,
            rating: 0
        });

        tutorSessions[_tutor].push(sessionId);
        userSessions[msg.sender].push(sessionId);

        emit SessionBooked(sessionId, msg.sender, _tutor, msg.value, _duration);
    }

    function startSession(uint256 _sessionId)
        external
        validSession(_sessionId)
        onlyTutor(_sessionId)
    {
        Session storage session = sessions[_sessionId];
        require(
            session.status == SessionStatus.Booked,
            "Session not in booked state"
        );

        session.status = SessionStatus.InProgress;
        session.startTime = block.timestamp;

        emit SessionStarted(_sessionId, block.timestamp);
    }

    function completeSession(uint256 _sessionId, uint8 _rating)
        external
        validSession(_sessionId)
        onlyStudent(_sessionId)
        nonReentrant
    {
        Session storage session = sessions[_sessionId];
        require(
            session.status == SessionStatus.InProgress,
            "Session not in progress"
        );
        require(
            _rating >= MIN_RATING && _rating <= MAX_RATING,
            "Invalid rating"
        );

        session.status = SessionStatus.Completed;
        session.rating = _rating;

        Tutor storage tutor = tutors[session.tutor];
        tutor.totalSessions++;
        tutor.totalRating += _rating;

        _processPayment(_sessionId);

        emit SessionCompleted(_sessionId, _rating);
    }

    function cancelSession(uint256 _sessionId, string memory reason)
        external
        validSession(_sessionId)
        nonReentrant
    {
        Session storage session = sessions[_sessionId];
        require(
            msg.sender == session.user || msg.sender == session.tutor,
            "Unauthorized"
        );
        require(
            session.status == SessionStatus.Booked,
            "Can only cancel booked sessions"
        );

        uint256 refundAmount = session.amount;
        session.status = SessionStatus.Cancelled;

        payable(session.user).transfer(refundAmount);

        emit SessionCancelled(_sessionId, reason);
    }

    function raiseDispute(uint256 _sessionId)
        external
        validSession(_sessionId)
    {
        Session storage session = sessions[_sessionId];
        require(
            msg.sender == session.user || msg.sender == session.tutor,
            "Unauthorized"
        );
        require(
            session.status == SessionStatus.InProgress,
            "Can only dispute active sessions"
        );

        session.status = SessionStatus.Disputed;
        emit SessionDisputed(_sessionId);
    }

    function timeoutSession(uint256 _sessionId)
        external
        validSession(_sessionId)
        nonReentrant
    {
        Session storage session = sessions[_sessionId];
        require(
            block.timestamp > session.bookedAt + SESSION_TIMEOUT,
            "Session not timed out yet"
        );
        require(
            session.status == SessionStatus.Booked,
            "Session not in booked state"
        );

        session.status = SessionStatus.TimedOut;

        bool success = payable(session.user).send(session.amount);
        require(success, "Refund failed");

        emit SessionTimedOut(_sessionId);
    }

    function _processPayment(uint256 _sessionId) internal {
        Session storage session = sessions[_sessionId];

        uint256 platformShare = session.amount.mul(platformFee).div(100);
        require(
            platformShare.add(BASE_TUTOR_SHARE_PERCENTAGE) <= 100,
            "Platform fee and tutor share exceed 100%"
        );
        uint256 baseAmount = session.amount.sub(platformShare);

        uint256 tutorBaseShare = baseAmount
            .mul(BASE_TUTOR_SHARE_PERCENTAGE)
            .div(100);
        uint256 ratingBonus = baseAmount.mul(20 * (session.rating - 1)).div(
            100 * (MAX_RATING - 1)
        );
        uint256 tutorShare = tutorBaseShare.add(ratingBonus);

        uint256 userRefund = session.amount.sub(tutorShare).sub(platformShare);

        _transferToTutor(payable(session.tutor), tutorShare);
        _transferToUser(payable(session.user), userRefund);

        emit PaymentProcessed(_sessionId, tutorShare, userRefund);
    }

    function _transferToTutor(address payable _tutor, uint256 _amount)
        internal
    {
        (bool tutorSuccess, ) = _tutor.call{value: _amount}("");
        require(tutorSuccess, "Tutor payment failed");
    }

    function _transferToUser(address payable _user, uint256 _amount) internal {
        if (_amount > 0) {
            (bool userSuccess, ) = _user.call{value: _amount}("");
            require(userSuccess, "User refund failed");
        }
    }

    // View Functions
    function getTutorRating(address _tutor) external view returns (uint256) {
        Tutor storage tutor = tutors[_tutor];
        if (tutor.totalSessions == 0) return 0;
        return tutor.totalRating / tutor.totalSessions;
    }

    function getTutorSessions(address _tutor)
        external
        view
        returns (uint256[] memory)
    {
        return tutorSessions[_tutor];
    }

    function getUserSessions(address _user)
        external
        view
        returns (uint256[] memory)
    {
        return userSessions[_user];
    }
}
