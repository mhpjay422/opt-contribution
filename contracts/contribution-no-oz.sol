// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";


contract ContributionNoOz is ReentrancyGuard {
  using Counters for Counters.Counter;
  Counters.Counter private _contributerCount;

  address owner;
  bool private canWithdraw;
  bool private canDeposit;
  uint private maxContribution;
  uint private shareValue;
  uint private contractBalance;
  mapping ( address => uint256 ) private balances;
  constructor() {
    owner = msg.sender;
    canWithdraw = false;
    canDeposit = true;
    maxContribution = 10;
  }

}