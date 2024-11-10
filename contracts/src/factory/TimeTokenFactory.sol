// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {TimeToken} from "../tokens/TimeToken.sol";
import {ITimeTokenFactory} from "../interfaces/ITimeTokenFactory.sol";

contract TimeTokenFactory is ITimeTokenFactory {
    function createTimeToken(
        string calldata name,
        string calldata symbol
    ) external returns (address) {
        TimeToken newToken = new TimeToken(name, symbol);
        newToken.transferOwnership(msg.sender);
        
        emit TimeTokenCreated(msg.sender, address(newToken), name, symbol);
        return address(newToken);
    }
}