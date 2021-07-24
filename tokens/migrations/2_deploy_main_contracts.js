const Denaris = artifacts.require("DENARISToken");
const Resource = artifacts.require("Resource");
const Farm = artifacts.require("Farm");

// Farm constructor
// address _stakeResourceAddress, string memory _name, address[] memory resources, uint256[] memory rewards)

module.exports = function(deployer, network, accounts) {
  const denaris = deployer.deploy(Denaris, 1000000000000000000000000000); // 1B
  const contractDenarisInstance = await denaris.deployed();

  const gold = await deployer.deploy(Resource, 0, "TerraeGold", "TGLD"); // 0
  const esmerald = await deployer.deploy(Resource, 0, "TerraeEsmerald", "TESM"); // 0
  const zaffir = await deployer.deploy(Resource, 0, "TerraeZaffir", "TZFR"); // 0
  const ruby = await deployer.deploy(Resource, 0, "TerraeRuby", "TRBY"); // 0

  const contractGoldInstance = await gold.deployed();
  const contractEsmeraldInstance = await esmerald.deployed();
  const contractZaffirInstance = await zaffir.deployed();
  const contractRubyInstance = await ruby.deployed();

  await deployer.deploy(Farm, contractDenarisInstance, "Gold Farm", [contractGoldInstance], [40000]);
  await deployer.deploy(Farm, contractDenarisInstance, "Esmerald Farm", [contractEsmeraldInstance], [40000]);
  await deployer.deploy(Farm, contractDenarisInstance, "Zaffir Farm", [contractZaffirInstance], [40000]);
  await deployer.deploy(Farm, contractDenarisInstance, "Ruby Farm", [contractRubyInstance], [40000]);
};