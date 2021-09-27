// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Contribution is Ownable {
  mapping ( address => uint256 ) public balances;
  uint private maxContribution;
  constructor() {
    maxContribution = 10;
  }

  function changeMaxContribution(uint newMaxContrinution) public onlyOwner{
    maxContribution = newMaxContrinution;
  }
}