# Terrae

Terrae is a Massive Multiplayer Online (MMO) strategy game, based on a medieval word. All assets (natural and monetary resources, armies, buildings and others), are registered on blockchain in a decentralized way, with no server intervention. Players become real owners of their in-game assets. Thanks that, they are able to trade valuated assets (like NFT warriors or yield farming positions) and so, monetize their progress (and their valuated time invested in games).

## DEFI smart contracts outline integration

The current project aims to test basic functionalities in Terrae world tokenomics, considering:

- Denaris ERC20 token
- Resources ERC20 tokens
- Soldiers NFT tokens

The real project will be using the core basics soon.
## Live version

Visit [demo](https://terrae-webapp.vercel.app)

## Terrae Project

Check [terragame.com](https://terraegame.com) for updates. The team is working hard and will be pushing updates soon.

## Deploy Smart Contracts

- Install Truffle and other dependencies
```
npm install
```

- Compile smart contracts:

```
truffle compile
```

- Migrate smart contracts to the blockchain, specifying one of the networks defined in truffle-config.js:

```
truffle migrate --network <rinkeby|tbinance|...>
```

- Run tests (needs ganache running) with:

```
truffle test
```

## TDEN Pool Pair Creation
To create the pool pair, use `CreatePair` function in `scripts/sc_interaction.js` script.
To retrieve the address of the pool pair, use `GetPoolPairAddress` function in `scripts/sc_interaction.js` script.
The first time you add liquidity to the pool, you will set the price token price, providing a relationship between TDEN and BNB or ETH.
Execute `AutomatePoolPair` function to complete the hole process, from creating the pair to prividing the liquidity.

## Contracts Current Deployments in testnet BSC

### Denaris:
0xceadbb9ef26f4e41a0e8d48940779af89695ff55

### Denaris-BNB Pair Pool:
0x0a174f9cf22e991565e52243125629448C1d95b3

### Resources:
- Gold: 0xE9c642Cf2714bf5d5644704eC61B962109bdC108
- Emerald: 0x3f30362F09D701D36CEc069b3CC3157006c6c835
- Sapphire: 0x61F1840941DafA9f8F38F0CD96166c4678633EA5
- Ruby: 0x64C4fE50F68b9f3eaCdBEce21461fb34eF3b12C9

### Farms:
- Gold: 0xCc5CA0949ED9a53dF3Eb228ce3Cdd3a74cE86b69
- Emerald: 0x6D19b36b2E402d66Abd7EC88901EE997eae3f7A4
- Sapphire: 0x0Ff619471a1E2F8eF89F94A2b2B44875499169Ab
- Ruby: 0x30ae084dFb90a44eA7574B8634c1F9c4ED6E7715

### Owner:
- 0x6F3eC0115A6aB1b91B6487b1889a3435b5D4DabE


## Contracts Current Deployments in Ribkeby

### Denaris:
0x13af5Bd11Ae33407b35728135eEEdbb2984fA764

### Denaris-WETH Pair Pool:
NN

### Resources:
- Gold: NN
- Emerald: NN
- Sapphire: NN
- Ruby: NN

### Farms:
- Gold: NN
- Emerald: NN
- Sapphire: NN
- Ruby: NN

### Owner:
- 0x6F3eC0115A6aB1b91B6487b1889a3435b5D4DabE