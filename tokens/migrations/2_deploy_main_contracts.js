const Denaris = artifacts.require("DENARISToken");
const Resource = artifacts.require("TerraeResource");
const Farm = artifacts.require("TerraeFarm");

// Farm constructor
// address _stakeResourceAddress, string memory _name, address[] memory resources, uint256[] memory rewards)

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(Denaris, "1000000000000000000000000000"); // 1M
  const contractDenarisInstance = await Denaris.deployed();

  await deployer.deploy(Resource, 0, "TerraeGold", "TGLD"); // 0
  const contractGoldInstance = await Resource.deployed();

  await deployer.deploy(Resource, 0, "TerraeEsmerald", "TESM"); // 0
  const contractEsmeraldInstance = await Resource.deployed();
  
  await deployer.deploy(Resource, 0, "TerraeZaffir", "TZFR"); // 0
  const contractZaffirInstance = await Resource.deployed();
  
  await deployer.deploy(Resource, 0, "TerraeRuby", "TRBY"); // 0
  const contractRubyInstance = await Resource.deployed();

  await deployer.deploy(Farm, contractDenarisInstance.address, "Gold Farm", [contractGoldInstance.address], [40000]);
  await deployer.deploy(Farm, contractDenarisInstance.address, "Esmerald Farm", [contractEsmeraldInstance.address], [40000]);
  await deployer.deploy(Farm, contractDenarisInstance.address, "Zaffir Farm", [contractZaffirInstance.address], [40000]);
  await deployer.deploy(Farm, contractDenarisInstance.address, "Ruby Farm", [contractRubyInstance.address], [40000]);
};