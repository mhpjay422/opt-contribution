// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";


contract ContributionNoOz is ReentrancyGuard {
  using Counters for Counters.Counter;
  Counters.Counter private _contributerCount;

  address private owner;
  bool private canWithdraw;
  bool private canDeposit;
  uint public maxContribution;
  uint public shareValue;
  uint public contractBalance;
  mapping ( address => uint256 ) public balances;
  constructor() {
    owner = msg.sender;
    canWithdraw = false;
    canDeposit = true;
    maxContribution = 10;
    shareValue = 0;
    contractBalance = 0;
  }

  function changeMaxContribution(uint newMaxContribution) external {
    require(msg.sender == owner, "only the owner may change the max contribution");
    maxContribution = newMaxContribution;
  }
  
  function closeContributionAndEnableWithdraw() external {
    require(msg.sender == owner, "only the owner may change the ability to withdraw");
    require(contractBalance > 0, "this contract has no balance");

    canWithdraw = true;
    canDeposit = false;
    shareValue = contractBalance / _contributerCount.current();
  }

  function transferOwnership(address newOwner) external {
    require(msg.sender == owner, "only the owner may use this function");
    owner = newOwner;
  }

  function deposit() external payable {
    require(canDeposit, "Deposit has been disabled");
    
    if(balances[msg.sender] >= 0) {
      balances[msg.sender] += msg.value;
    } else {
      balances[msg.sender] = msg.value;
      _contributerCount.increment();
    } 
    contractBalance += msg.value;

    require(balances[msg.sender] <= 10, "your balance is greater than the allowed amount");
  }

  function withdraw() external {
    require(canWithdraw == true, "withdraw is not enabled");
    require(balances[msg.sender] >= 0, "You are not eligible to withdraw");

    balances[msg.sender] = 0;
    (bool sent, bytes memory data) = msg.sender.call{value: shareValue}("");
    require(sent, "Failed to send Ether");
  }
}