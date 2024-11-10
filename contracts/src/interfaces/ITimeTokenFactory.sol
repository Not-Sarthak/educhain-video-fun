// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface ITimeTokenFactory {
    event TimeTokenCreated(
        address indexed creator,
        address indexed tokenAddress,
        string name,
        string symbol
    );
    
    function createTimeToken(
        string calldata name,
        string calldata symbol
    ) external returns (address);
}