// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract DENARISToken is ERC20 {
  constructor(uint256 initialSupply) ERC20("Denaris", "DENARIS") {
    _mint(msg.sender, initialSupply);
  }
}