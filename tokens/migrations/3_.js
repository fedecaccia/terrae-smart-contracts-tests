const Denaris = artifacts.require("DENARISToken");
const Resource = artifacts.require("TerraeResource");
const Farm = artifacts.require("TerraeFarm");

// Farm constructor
// address _stakeResourceAddress, string memory _name, address[] memory resources, uint256[] memory rewards)

module.exports = async (deployer, network, accounts) => {

  const contractDenarisInstanceAddress = "0xceadbb9ef26f4e41a0e8d48940779af89695ff55";
  const contractGoldInstanceAddress = "0xE9c642Cf2714bf5d5644704eC61B962109bdC108";
  const contractEmeraldInstanceAddress = "0x3f30362F09D701D36CEc069b3CC3157006c6c835";
  const contractSapphireInstanceAddress = "0x61F1840941DafA9f8F38F0CD96166c4678633EA5";
  const contractRubyInstanceAddress = "0x64C4fE50F68b9f3eaCdBEce21461fb34eF3b12C9";

  await deployer.deploy(Farm, contractDenarisInstanceAddress, "Gold Farm", [contractGoldInstanceAddress], ["15000000000000000"]);
  await deployer.deploy(Farm, contractDenarisInstanceAddress, "Emerald Farm", [contractEmeraldInstanceAddress], ["15000000000000000"]);
  await deployer.deploy(Farm, contractDenarisInstanceAddress, "Sapphire Farm", [contractSapphireInstanceAddress], ["15000000000000000"]);
  await deployer.deploy(Farm, contractDenarisInstanceAddress, "Ruby Farm", [contractRubyInstanceAddress], ["15000000000000000"]);
};