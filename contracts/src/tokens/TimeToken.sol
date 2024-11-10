// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";
import {ITimeToken} from "../interfaces/ITimeToken.sol";

contract TimeToken is ITimeToken, ERC20, Ownable, ReentrancyGuard, Pausable {
    // Constants - packed into single storage slot
    uint96 public constant MINUTES_PER_TOKEN = 1;
    uint96 public constant MAX_FEE = 1000; // 10% maximum fee
    
    // State variables - packed into single storage slot
    uint96 public tradingFeePercent = 250; // 2.5%
    uint96 public redemptionFeePercent = 500; // 5%
    uint64 public timeSlotCount;
    
    // Optimized TimeSlot struct - packed into two storage slots
    struct TimeSlot {
        uint64 startTime;
        uint32 duration;
        bool isBooked;
        address bookedBy;
    }
    
    // Storage
    mapping(uint256 => TimeSlot) public timeSlots;
    
    constructor(
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) Ownable(msg.sender) {
        _pause(); // Start paused for safety
    }
    
    // External functions
    function mintTime(uint256 minute) external onlyOwner {
        if(minute == 0) revert InvalidAmount();
        _mint(msg.sender, minute * MINUTES_PER_TOKEN);
        emit TimeMinted(minute);
    }
    
    function addTimeSlot(
        uint64 startTime,
        uint32 duration
    ) external onlyOwner {
        if(startTime <= uint64(block.timestamp)) revert InvalidStartTime();
        if(duration == 0) revert InvalidDuration();
        
        uint256 slotIndex = timeSlotCount;
        timeSlots[slotIndex] = TimeSlot({
            startTime: startTime,
            duration: duration,
            isBooked: false,
            bookedBy: address(0)
        });
        
        unchecked {
            ++timeSlotCount;
        }
        
        emit TimeSlotAdded(slotIndex, startTime, duration);
    }
    
    function redeemTime(
        uint256 slotIndex,
        uint32 minute
    ) external nonReentrant whenNotPaused {
        if(slotIndex >= timeSlotCount) revert InvalidSlotIndex();
        
        TimeSlot storage slot = timeSlots[slotIndex];
        if(slot.isBooked) revert SlotAlreadyBooked();
        if(slot.startTime <= uint64(block.timestamp)) revert SlotExpired();
        if(minute > slot.duration) revert ExceedsDuration();
        
        uint256 tokensRequired = minute * MINUTES_PER_TOKEN;
        uint256 redemptionFee = (tokensRequired * redemptionFeePercent) / 10000;
        uint256 totalCost = tokensRequired + redemptionFee;
        
        if(balanceOf(msg.sender) < totalCost) revert InsufficientBalance();
        
        _transfer(msg.sender, owner(), totalCost);
        
        slot.isBooked = true;
        slot.bookedBy = msg.sender;
        
        emit TimeRedeemed(msg.sender, minute, slotIndex);
    }
    
    function transfer(
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        if(to == address(0)) revert InvalidRecipient();
        
        uint256 tradingFee = (amount * tradingFeePercent) / 10000;
        uint256 totalAmount = amount + tradingFee;
        
        if(balanceOf(msg.sender) < totalAmount) revert InsufficientBalance();
        
        _transfer(msg.sender, to, amount);
        _transfer(msg.sender, owner(), tradingFee);
        
        return true;
    }
    
    // Admin functions
    function setTradingFee(uint96 newFeePercent) external onlyOwner {
        if(newFeePercent > MAX_FEE) revert FeeTooHigh();
        tradingFeePercent = newFeePercent;
        emit FeeUpdated("Trading", newFeePercent);
    }
    
    function setRedemptionFee(uint96 newFeePercent) external onlyOwner {
        if(newFeePercent > MAX_FEE) revert FeeTooHigh();
        redemptionFeePercent = newFeePercent;
        emit FeeUpdated("Redemption", newFeePercent);
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // View functions
    function getTimeSlot(uint256 slotIndex) external view returns (TimeSlot memory) {
        if(slotIndex >= timeSlotCount) revert InvalidSlotIndex();
        return timeSlots[slotIndex];
    }
    
    function getAvailableSlots() external view returns (uint256[] memory) {
        uint256[] memory availableSlots = new uint256[](timeSlotCount);
        uint256 count;
        
        for(uint256 i; i < timeSlotCount;) {
            if(!timeSlots[i].isBooked) {
                availableSlots[count] = i;
                unchecked {
                    ++count;
                }
            }
            unchecked {
                ++i;
            }
        }
        
        // Resize array to actual count
        assembly {
            mstore(availableSlots, count)
        }
        
        return availableSlots;
    }
}