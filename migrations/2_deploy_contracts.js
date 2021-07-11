var Denaris = artifacts.require("DENARISToken");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(Denaris, 1000000000000000);
};