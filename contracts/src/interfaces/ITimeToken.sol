// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface ITimeToken {
    // Events
    event TimeMinted(uint256 amount);
    event TimeSlotAdded(uint256 indexed slotIndex, uint64 startTime, uint32 duration);
    event TimeRedeemed(address indexed redeemer, uint32 minute, uint256 slotIndex);
    event FeeUpdated(string feeType, uint256 newFee);
    
    // Custom errors
    error InvalidAmount();
    error InvalidStartTime();
    error InvalidDuration();
    error InvalidSlotIndex();
    error SlotAlreadyBooked();
    error SlotExpired();
    error ExceedsDuration();
    error InsufficientBalance();
    error InvalidRecipient();
    error FeeTooHigh();
}