require("dotenv").config();

// const infuraKey = process.env.INFURA_KEY;
// const uniswapV2Address = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
// const myAddress = "0x6F3eC0115A6aB1b91B6487b1889a3435b5D4DabE";
// const jsonInterface = require("./uniswapV2aabi.json");
// const networkUrl = `https://rinkeby.infura.io/v3/${infuraKey}`;

const { FACTORY_ADDRESS, INIT_CODE_HASH } = require ('@uniswap/sdk')
const { pack, keccak256 } = require ('@ethersproject/solidity')
const { getCreate2Address } = require ('@ethersproject/address')

/**
PancakeSwap on BSC testnet:

Factory: 0x6725F303b657a9451d8BA641348b6761A6CC7a17
Router: 0xD99D1c33F9fC3444f8101754aBC46c52416550D1

*/


const denaris = "0xceadbb9ef26f4e41a0e8d48940779af89695ff55";
const wbnb = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';


const create = async () => {
  
  const pair = await getCreate2Address(
    FACTORY_ADDRESS,
    keccak256(['bytes'], [pack(['address', 'address'], [wbnb, denaris])]),
    INIT_CODE_HASH
  )
  return pair;
}

create().then(console.log).catch(console.log);