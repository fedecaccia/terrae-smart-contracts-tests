const Denaris = artifacts.require("DENARISToken");
const Resource = artifacts.require("TerraeResource");
const Farm = artifacts.require("TerraeFarm");

// Farm constructor
// address _stakeResourceAddress, string memory _name, address[] memory resources, uint256[] memory rewards)

module.exports = async (deployer, network, accounts) => {

  contractDenarisInstance = { address: "0xceadbb9ef26f4e41a0e8d48940779af89695ff55" }
  contractGoldInstance = { address: "0xD6E915Ec2991e6ED27B70e6f14BBBFcB82BBD8Eb" }
  contractEmeraldInstance = { address: "0x403F32c7E8b8dB7a8fFA52b183746C0b29f33570" }
  contractSapphireInstance = { address: "0xb4a2826fC5Da2b8385a3a154960efB1e450065d1" }
  contractRubyInstance = { address: "0xC05101497AE24241cE8494866F1e000b49921117" }

  await deployer.deploy(Farm, contractDenarisInstance.address, "Gold Farm", [contractGoldInstance.address], ["15000000000000000"]);
  await deployer.deploy(Farm, contractDenarisInstance.address, "Emerald Farm", [contractEmeraldInstance.address], ["15000000000000000"]);
  await deployer.deploy(Farm, contractDenarisInstance.address, "Sapphire Farm", [contractSapphireInstance.address], ["15000000000000000"]);
  await deployer.deploy(Farm, contractDenarisInstance.address, "Ruby Farm", [contractRubyInstance.address], ["15000000000000000"]);
};