# Terrae

Terrae is a Massive Multiplayer Online (MMO) strategy game, based on a medieval word. All assets (natural and monetary resources, armies, buildings and others), are registered on blockchain in a decentralized way, with no server intervention. Players become real owners of their in-game assets. Thanks that, they are able to trade valuated assets (like NFT warriors or yield farming positions) and so, monetize their progress (and their valuated time invested in games).

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