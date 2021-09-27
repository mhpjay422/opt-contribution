// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

abstract contract Contribution is Ownable, PaymentSplitter {
  uint private maxContribution;
  constructor() {
    maxContribution = 10;
  }

  function deposit() external payable {}
  function changeMaxContribution(uint newMaxContrinution) external onlyOwner{
    maxContribution = newMaxContrinution;
  }
}