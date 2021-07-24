// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./openzeppelin-contracts/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "./openzeppelin-contracts/contracts/access/Ownable.sol";
import "./Denaris.sol";
import "./openzeppelin-contracts/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

// CAUTION
// This version of ERC20 should only be used with Solidity 0.8 or later,
// because it relies on the compiler's built in overflow checks. (reverts on overflow)


contract TerraeFarm is Ownable {

  uint256 public constant DEFAULT_ADMIN_ROLE = 0x00;
  address private stakeResourceAddress;

  string name;
  address[] rewardResources;
  uint256[] rewardsPerBlock;

  uint256 firstBlock;
  uint256 endBlock;

  mapping(address => uint256) userStake;
  mapping(address => uint256) userLastRewardedBlock;

  constructor(address _stakeResourceAddress, string memory _name, address[] memory resources, uint256[] memory rewards) Ownable() {
    stakeResourceAddress = _stakeResourceAddress;
    name = _name;
    rewardResources = resources;
    rewardsPerBlock = rewards;
  }

  function harvestAndStake(uint256 amount) external {
    harvest();
    
    // after harvest, to not affect the stake
    _stake(amount);
  }

  function harvestAndUnstake (uint256 amount) public {
    harvest();

    // after harvest, to not affect the stake
    _unstake(amount);
  }


  function harvest () public {
    uint256 deltaBlocks = block.number - userLastRewardedBlock[msg.sender];
    userLastRewardedBlock[msg.sender] = block.number;

    for (uint256 i=0; i<rewardResources.length; i++) {
      uint256 amountToHarvest = deltaBlocks * rewardsPerBlock[i] * userStake[msg.sender];

      ERC20PresetMinterPauser(rewardResources[i]).transfer(msg.sender, amountToHarvest);
    }
  }

  /* _stake is private to ensure it is called only after a harvest process, so we start from zero with accumulated rewards */ 

  function _stake(uint256 amount) private {
    DENARISToken(stakeResourceAddress).transferFrom(msg.sender, address(this), amount);
    userStake[msg.sender] = userStake[msg.sender] + amount;
  }

  
  function _unstake (uint256 amount) public {
    userStake[msg.sender] = userStake[msg.sender] - amount;
    DENARISToken(stakeResourceAddress).transfer(msg.sender, amount);
  }

  function getAddressReward(uint256 resourceType, address account) public view returns(uint256) {
    uint256 deltaBlocks = block.number - userLastRewardedBlock[msg.sender];    
    uint256 amountToHarvest = deltaBlocks * rewardsPerBlock[resourceType] * userStake[account];
    return amountToHarvest;
  }

  function getAddressStake(address account) public view returns(uint256) {    
    return userStake[account];
  }
}