# Terrae

## Deploy Smart Contracts

Needs to be working on `one of `{denaris, resources}` directory.

- Install Truffle and dependencies

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