// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

contract Contribution{
  address owner;
  uint private maxContribution;
  bool private canWithdraw;
  mapping ( address => uint256 ) private balances;
  constructor() {
    owner = msg.sender;
    maxContribution = 10;
  }

  function setWithdraw(bool enableWithdraw) external {
    require(msg.sender == owner, "only the owner may change the ability to withdraw");

    canWithdraw = enableWithdraw;
  }

  function deposit() external payable {
    balances[msg.sender] += msg.value;
  }
  function changeMaxContribution(uint newMaxContrinution) external {
    require(msg.sender == owner, "only the owner may change the max contribution");
    maxContribution = newMaxContrinution;
  }
}