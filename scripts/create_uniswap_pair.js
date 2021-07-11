require("dotenv").config();

// const infuraKey = process.env.INFURA_KEY;
// const uniswapV2Address = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
// const myAddress = "0x6F3eC0115A6aB1b91B6487b1889a3435b5D4DabE";
// const jsonInterface = require("./uniswapV2aabi.json");

// const denaris = "0xA1BD14aAa46fF0a622A98b8dF3147a7EfFB9c2cf";
// const bnb = "0xe800da86830a012dbede538f834b3a1fcc9cb642";
// const networkUrl = `https://rinkeby.infura.io/v3/${infuraKey}`;


const { FACTORY_ADDRESS, INIT_CODE_HASH } = require ('@uniswap/sdk')
const { pack, keccak256 } = require ('@ethersproject/solidity')
const { getCreate2Address } = require ('@ethersproject/address')

const token0 = '0xe800da86830a012dbede538f834b3a1fcc9cb642';
const token1 = '0xA1BD14aAa46fF0a622A98b8dF3147a7EfFB9c2cf';


const create = async () => {
  
  const pair = await getCreate2Address(
    FACTORY_ADDRESS,
    keccak256(['bytes'], [pack(['address', 'address'], [token0, token1])]),
    INIT_CODE_HASH
  )
  return pair;
}

create().then(console.log).catch(console.log);