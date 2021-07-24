// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./openzeppelin-contracts/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

contract TerraeResource is ERC20PresetMinterPauser {
  constructor(uint256 initialSupply, string memory name, string memory symbol) ERC20PresetMinterPauser(name, symbol) {}
}