require("dotenv").config();
const bignumber = require("bignumber.js");
const fs = require("fs");
const Web3 = require("web3");
const Tx = require('ethereumjs-tx').Transaction;
const InputDataDecoder = require('ethereum-input-data-decoder');


const rawDenarisAbi = fs.readFileSync("denarisAbi.json");
const contractDenarisAbi = JSON.parse(rawDenarisAbi);

const rawUniswapV2FactoryAbi = fs.readFileSync("uniswapV2FactoryAbi.json");
const contractUniswapV2FactoryAbi = JSON.parse(rawUniswapV2FactoryAbi);

const rawUniswapV2Router02Abi = fs.readFileSync("uniswapV2Router02Abi.json");
const contractUniswapV2Router02Abi = JSON.parse(rawUniswapV2Router02Abi);

const rawPancakeRouterAbi = fs.readFileSync("uniswapV2Router02Abi.json");
const contractPancakeRouterAbi = JSON.parse(rawPancakeRouterAbi);

const rawResourceAbi = fs.readFileSync("resourceAbi.json");
const contractResourceAbi = JSON.parse(rawResourceAbi);

const denarisAddressTBNB = "0xceadbb9ef26f4e41a0e8d48940779af89695ff55";
const wbnbAddress = "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd";

const denarisAddressRinkeby = "0x13af5Bd11Ae33407b35728135eEEdbb2984fA764";
const wethAddress = "0xc778417e063141139fce010982780140aa0cd5ab";

const myAddress = "0x6F3eC0115A6aB1b91B6487b1889a3435b5D4DabE";
const myPrivKey = "65e680d361d67e60198b6728cd4fbe22178b6651f9115410d0266f1d957b3f8d";
const testAddress = "0xE8AB21130d7F8Cc4093dA53170625510b55E9b21";
const testPrivKey = "0x5e0e0de1979176d3813e5cb8451d935e6b35ae99071d9856c67a7cf405f1f1e6";
const randomPrivKey = "0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709";

const pancakeFactory = "0x6725F303b657a9451d8BA641348b6761A6CC7a17";
const pancakeRouter = "0xD99D1c33F9fC3444f8101754aBC46c52416550D1";

const rinkebyFactory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
const rinkebyRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

const kobanFactory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
const kobanRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

const ropstenRFactory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
const ropstenRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";


const tBinanceFarms = {
  gold: "0xCc5CA0949ED9a53dF3Eb228ce3Cdd3a74cE86b69",      
  emerald: "0x6D19b36b2E402d66Abd7EC88901EE997eae3f7A4",
  sapphire: "0x0Ff619471a1E2F8eF89F94A2b2B44875499169Ab",
  ruby: "0x30ae084dFb90a44eA7574B8634c1F9c4ED6E7715",      
};
const tBinanceResources = {
  gold: "0xE9c642Cf2714bf5d5644704eC61B962109bdC108",
  emerald: "0x3f30362F09D701D36CEc069b3CC3157006c6c835",
  sapphire: "0x61F1840941DafA9f8F38F0CD96166c4678633EA5",
  ruby: "0x64C4fE50F68b9f3eaCdBEce21461fb34eF3b12C9",
};

const getChainNumber = ({ blockchain, network }) => {
  switch(blockchain){
    case "ethereum":
      switch(network){
        case "mainnet":
          return 1;
        case "ropsten":
          return 3;
        case "rinkeby":
          return 4;
        case "goerli":
          return 5;
        case "kovan":
          return 42;
        default:
          throw new Error("Bad network");
      }
    case "binance":
      switch(network){
        case "mainnet":
          return 56;
        case "testnet":
          return 97;
        default:
          throw new Error("Bad network");
      }
    default:
      throw new Error("Bad blockchain");
  };
}

const getNetworkEndpoint = ({blockchain, network}) => {

  switch(blockchain){
    case "ethereum":
      return `https://${network}.infura.io/v3/${process.env.INFURA_ACCESS_TOKEN}`;
    case "binance":
      switch(network){
        case "testnet":
          return `https://data-seed-prebsc-1-s1.binance.org:8545`;
        case "mainnet":
          return `https://bsc-dataseed1.binance.org`;
        default:
          throw new Error("Bad network");
      }
    default:
      throw new Error("Bad blockchain");
  };
};

const GetChainId = async (options) => {
  let web3 = new Web3(getNetworkEndpoint(options));

  return await web3.eth.net.getId(); // in decimal
}

const ImportAccount = async (options) => {
  let web3 = new Web3(getNetworkEndpoint(options));  

  return web3.eth.accounts.privateKeyToAccount(options.privKey);
}

/* Signed Transaction example

  {
    messageHash: '0x4d5112d0ee054d11738508e2186ee7cb1df3d43b98266e0d6298069bbadc41a6',
    v: '0x00',
    r: '0x00000000000000000000',
    s: '0x00000000000000000000',
    rawTransaction: '0xf869728502540be400831e848094e8ab21130d7f8cc4093da53170625510b55e9b21830f42408081e6a076175db79926a97bd245204df9385cbbfb8f07e2786902b3f6186c43554f542ba007ede6b312d6cc9110eba07f1c6c4f23884391c68608e9297201d9b4dbe72afa',
    transactionHash: '0xe82e808ce359cd786471139ddacbba7e61863c98d70997ae35868cabc8bd6bf3'
  }
*/

const SignTransaction = async (options) => {
  let web3 = new Web3(getNetworkEndpoint(options));

  let signature = web3.eth.accounts.signTransaction({
    to: options.to,
    value: options.amount,
    gas: 2000000,
    gasPrice: "0x2540BE400", // default will use web3.eth.getGasPrice(), // 10000000000 (10 gwei)
    // gasPrice: "234567897654321", // default will use web3.eth.getGasPrice()
    // nonce: 0, // default will use web3.eth.getTransactionCount()
    // chainId: 1, // default will use web3.eth.net.getId()
  }, options.privKey);
  
  return signature;
}

const SendSignedTransaction = async (options) => {
  let web3 = new Web3(getNetworkEndpoint(options));

  var rawTx = {
    to: options.to,
    value: options.amount,
    gasLimit: 2000000,
    gasPrice: "0x2540BE400", // default will use web3.eth.getGasPrice(), // 10000000000 (10 gwei)
    // gasPrice: "234567897654321", // default will use web3.eth.getGasPrice()
    // nonce: 0, // default will use web3.eth.getTransactionCount()
    // chainId: 1, // default will use web3.eth.net.getId()
    data: options.data
  }
  
  var tx = new Tx(rawTx, {
    // 'chain':'ropsten'
  });
  tx.sign(Buffer.from(options.privKey));
  
  var serializedTx = tx.serialize();
  
  web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
  .on('receipt', console.log);
}

const AddAccountToWallet = async (options) => {
  let web3 = new Web3(getNetworkEndpoint(options));

  return web3.eth.accounts.wallet.add(options.privKey);
}

const SecureClearWallet = async (options) => {
  let web3 = new Web3(getNetworkEndpoint(options));

  return web3.eth.accounts.wallet.clear();
}

const GetGasPrice = async (options) => {
  let web3 = new Web3(getNetworkEndpoint(options));
  await web3.eth.requestAccounts().then(console.log);
  return await web3.eth.getGasPrice().then((price) => console.log(`Gas Price: ${price} wei`));
}

const GetAddressBalance = async (options) => {
  let web3 = new Web3(getNetworkEndpoint(options));
  web3.eth.defaultAccount = options.from;

  const contractInstanceAddress = web3.utils.toChecksumAddress(options.denarisAddress);
  const checksummedParamAddress = web3.utils.toChecksumAddress(options.from);

  const contractInstance = new web3.eth.Contract(contractDenarisAbi, contractInstanceAddress);
          
  let balance = await contractInstance.methods.balanceOf(checksummedParamAddress).call();
  let decimals = await contractInstance.methods.decimals().call();
  
  return bignumber(balance).dividedBy(10**decimals).toString();
};

/* Tx receipt example

  "transactionHash": "0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b",
  "transactionIndex": 0,
  "blockHash": "0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46",
  "blockNumber": 3,
  "contractAddress": "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe",
  "cumulativeGasUsed": 314159,
  "gasUsed": 30234,
  "events": {
      "MyEvent": {
          returnValues: {
              myIndexedParam: 20,
              myOtherIndexedParam: '0x123456789...',
              myNonIndexParam: 'My String'
          },
          raw: {
              data: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
              topics: ['0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7', '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385']
          },
          event: 'MyEvent',
          signature: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
          logIndex: 0,
          transactionIndex: 0,
          transactionHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
          blockHash: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
          blockNumber: 1234,
          address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'
      },
      "MyOtherEvent": {
          ...
      },
      "MyMultipleEvent":[{...}, {...}] // If there are multiple of the same event, they will be in an array
  }
*/

const TransferDenaris = async (options) => {
  let web3 = new Web3(getNetworkEndpoint(options));
  web3.eth.accounts.wallet.add(web3.eth.accounts.privateKeyToAccount(options.privKey));  

  const contractInstanceAddress = web3.utils.toChecksumAddress(options.denarisAddress);

  const contractInstance = new web3.eth.Contract(contractDenarisAbi, contractInstanceAddress);

  const count = await web3.eth.getTransactionCount(options.from);

  const contractOptions = {
    from: options.from,
    value: "0x00",
    gasLimit: "0x30D40",
    gasPrice: "0x2540BE400", // default will use web3.eth.getGasPrice(), // 10000000000 (10 gwei)
    // gasPrice: "0x4A817C800", // default will use web3.eth.getGasPrice(), // 20000000000 (20 gwei)
    nonce: web3.utils.toHex(count), // default will use web3.eth.getTransactionCount()
    // chainId: 1, // default will use web3.eth.net.getId()
  }
  
  return contractInstance.methods.transfer(options.to, options.tokenAmount).send(contractOptions)
  .once('sent', function(payload){
    console.log(payload)
  });
  // .on('transactionHash', function(hash){
  //   console.log(hash);
  //   web3.eth.accounts.wallet.clear();
  // })
  // .once('confirmation', function(confirmationNumber, receipt){
  //   console.log(confirmationNumber);
  //   console.log(receipt);
  // })
  // .once('receipt', function(receipt){
  //     console.log(receipt);
  // })
  // .on('error', function(error, receipt) {
  //     console.log(error);
  //     console.log(receipt);
  //     web3.eth.accounts.wallet.clear();
  // });
};

const SendDenaris = async (options) => {
  let web3 = new Web3(getNetworkEndpoint(options));

  const contractInstanceAddress = web3.utils.toChecksumAddress(options.denarisAddress);
  const contractInstance = new web3.eth.Contract(contractDenarisAbi, contractInstanceAddress);

  let encoded = contractInstance.methods.transfer(options.to, options.tokenAmount).encodeABI();
  // const decoder = new InputDataDecoder(`${__dirname}/denarisAbi.json`);
  // const result = decoder.decodeData(encoded);
  // console.log(bignumber(result.inputs[1]).toString());  
  
  const count = await web3.eth.getTransactionCount(options.from);

  var rawTx = {
    from: options.from,
    to: options.denarisAddress,
    value: "0x00",
    gasLimit: "0x30D40",
    gasPrice: "0x2540BE400", // default will use web3.eth.getGasPrice(), // 10000000000 (10 gwei)
    // gasPrice: "0x4A817C800", // default will use web3.eth.getGasPrice(), // 20000000000 (20 gwei)
    nonce: web3.utils.toHex(count), // default will use web3.eth.getTransactionCount()
    // chainId: 1, // default will use web3.eth.net.getId()
    data: encoded
  } 

  // /* using ethereumjs-tx */

  // let tx = new Tx(rawTx, {
  //   'chain': getChainNumber({blockchain: options.blockchain, network: options.network})
  // });
  // tx.sign(Buffer.from(options.privKey, "hex"));  
  // const serializedTx = tx.serialize();
  // const finalTx = "0x" + serializedTx.toString("hex");
  // console.log(finalTx);

  // /* using web3 */

  let signature = await web3.eth.accounts.signTransaction(rawTx, options.privKey);
  let finalTx = signature.rawTransaction;
  
  return web3.eth.sendSignedTransaction(finalTx)
  // .once('sending', function(payload){ console.log(payload) })
  .once('sent', function(payload){ console.log(payload) })
  // .once('transactionHash', function(hash){ console.log(hash) })
  // .once('receipt', function(receipt){ console.log(receipt) })
  // .on('confirmation', function(confNumber, receipt, latestBlockHash){ console.log(confNumber);console.log(receipt);console.log(latestBlockHash); })
  // .on('error', function(error){ console.log(error) })
};

const CreatePair = async (options) => {

  let web3 = new Web3(getNetworkEndpoint(options));
  web3.eth.accounts.wallet.add(web3.eth.accounts.privateKeyToAccount(options.privKey));  

  const contractInstanceAddress = web3.utils.toChecksumAddress(options.factoryAddress);
  const contractInstance = new web3.eth.Contract(contractUniswapV2FactoryAbi, contractInstanceAddress);

  const count = await web3.eth.getTransactionCount(options.from);

  const contractOptions = {
    from: options.from,
    value: "0x00",
    gasLimit: "0x989680",
    gasPrice: "0x2540BE400", // default will use web3.eth.getGasPrice(), // 10000000000 (10 gwei)
    // gasPrice: "0x4A817C800", // default will use web3.eth.getGasPrice(), // 20000000000 (20 gwei)
    nonce: web3.utils.toHex(count), // default will use web3.eth.getTransactionCount()
    // chainId: 1, // default will use web3.eth.net.getId()
  }
  
  return contractInstance.methods.createPair(options.tokenA, options.tokenB).send(contractOptions)
  .once('sent', function(payload){
    console.log(payload)
  });
}

const GetPoolPairAddress = async (options) => {

  let web3 = new Web3(getNetworkEndpoint(options));
  web3.eth.accounts.wallet.add(web3.eth.accounts.privateKeyToAccount(options.privKey));  

  const contractInstanceAddress = web3.utils.toChecksumAddress(options.factoryAddress);
  const contractInstance = new web3.eth.Contract(contractUniswapV2FactoryAbi, contractInstanceAddress);

  const contractOptions = {
    from: options.from
  }
  
  return contractInstance.methods.getPair(options.tokenA, options.tokenB).call(contractOptions);
}

const AddLiquidityETH = async (options) => {

  let web3 = new Web3(getNetworkEndpoint(options));
  web3.eth.accounts.wallet.add(web3.eth.accounts.privateKeyToAccount(options.privKey));

  const tokenContractInstanceAddress = web3.utils.toChecksumAddress(options.addLiquidityETH.tokenAddress);
  const tokenContractInstance = new web3.eth.Contract(contractDenarisAbi, tokenContractInstanceAddress);

  const contractInstanceAddress = web3.utils.toChecksumAddress(options.routerAddress);
  const contractInstance = new web3.eth.Contract(options.contractRouterAbi, contractInstanceAddress);

  const count = await web3.eth.getTransactionCount(options.from);

  // First, give allowance to router
  let contractOptions = {
    from: options.from,
    value: "0x00",
    gasLimit: "0x989680",
    gasPrice: "0x2540BE400", // default will use web3.eth.getGasPrice(), // 10000000000 (10 gwei)
    // gasPrice: "0x4A817C800", // default will use web3.eth.getGasPrice(), // 20000000000 (20 gwei)
    nonce: web3.utils.toHex(count), // default will use web3.eth.getTransactionCount()
    // chainId: 1, // default will use web3.eth.net.getId()
  }
  let res = await tokenContractInstance.methods.approve(
    options.routerAddress,
    options.addLiquidityETH.amountToken
  ).send(contractOptions);

  console.log(res);

  // Second, add liquidity

  contractOptions = {
    from: options.from,
    value: web3.utils.toHex(web3.utils.toWei(options.addLiquidityETH.amountETH.toString())),
    gasLimit: "0x989680",
    gasPrice: "0x2540BE400", // default will use web3.eth.getGasPrice(), // 10000000000 (10 gwei)
    // gasPrice: "0x4A817C800", // default will use web3.eth.getGasPrice(), // 20000000000 (20 gwei)
    nonce: web3.utils.toHex(count+1), // default will use web3.eth.getTransactionCount()
    // chainId: 1, // default will use web3.eth.net.getId()
  }
  /* inputs
  [
    {"internalType":"address","name":"token","type":"address"},
    {"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},
    {"internalType":"uint256","name":"amountTokenMin","type":"uint256"},
    {"internalType":"uint256","name":"amountETHMin","type":"uint256"},
    {"internalType":"address","name":"to","type":"address"},
    {"internalType":"uint256","name":"deadline","type":"uint256"}]
  */
  return contractInstance.methods.addLiquidityETH(
    options.addLiquidityETH.tokenAddress,
    options.addLiquidityETH.amountToken,
    options.addLiquidityETH.amountTokenMin,
    web3.utils.toWei(options.addLiquidityETH.amountETHMin.toString()),
    options.addLiquidityETH.to,
    options.addLiquidityETH.deadline
  ).send(contractOptions);
}

const RemoveLiquidityETH = async (options) => {

  let web3 = new Web3(getNetworkEndpoint(options));
  web3.eth.accounts.wallet.add(web3.eth.accounts.privateKeyToAccount(options.privKey));

  const tokenContractInstanceAddress = web3.utils.toChecksumAddress(options.removeLiquidityETH.tokenAddress);
  const tokenContractInstance = new web3.eth.Contract(contractDenarisAbi, tokenContractInstanceAddress);

  const contractInstanceAddress = web3.utils.toChecksumAddress(options.routerAddress);
  const contractInstance = new web3.eth.Contract(options.contractRouterAbi, contractInstanceAddress);

  const count = await web3.eth.getTransactionCount(options.from);

  // No need to give allowance to router

  // Second, remove liquidity

  contractOptions = {
    from: options.from,
    value: "0x00",
    gasLimit: "0x989680",
    gasPrice: "0x2540BE400", // default will use web3.eth.getGasPrice(), // 10000000000 (10 gwei)
    // gasPrice: "0x4A817C800", // default will use web3.eth.getGasPrice(), // 20000000000 (20 gwei)
    nonce: web3.utils.toHex(count), // default will use web3.eth.getTransactionCount()
    // chainId: 1, // default will use web3.eth.net.getId()
  }
  /* inputs
  [
    {"internalType":"address","name":"token","type":"address"},
    {"internalType":"uint256","name":"liquidity","type":"uint256"},
    {"internalType":"uint256","name":"amountTokenMin","type":"uint256"},
    {"internalType":"uint256","name":"amountETHMin","type":"uint256"},
    {"internalType":"address","name":"to","type":"address"},
    {"internalType":"uint256","name":"deadline","type":"uint256"}
  ]
  */
  return contractInstance.methods.removeLiquidityETH(
    options.removeLiquidityETH.tokenAddress,
    options.removeLiquidityETH.amountLP,
    options.removeLiquidityETH.amountTokenMin,
    web3.utils.toWei(options.addLiquidityETH.amountETHMin.toString()),
    options.removeLiquidityETH.to,
    options.removeLiquidityETH.deadline
  ).send(contractOptions);
}


const SwapExactETHForTokens = async (options) => {

  let web3 = new Web3(getNetworkEndpoint(options));
  web3.eth.accounts.wallet.add(web3.eth.accounts.privateKeyToAccount(options.privKey));

  const contractInstanceAddress = web3.utils.toChecksumAddress(options.routerAddress);
  const contractInstance = new web3.eth.Contract(options.contractRouterAbi, contractInstanceAddress);

  const count = await web3.eth.getTransactionCount(options.from);

  // First, no need to give allowance!

  // Second, swap!

  contractOptions = {
    from: options.from,
    value: web3.utils.toHex(web3.utils.toWei(options.swapExactETHForTokens.amountETH.toString())),
    gasLimit: "0x989680",
    gasPrice: "0x2540BE400", // default will use web3.eth.getGasPrice(), // 10000000000 (10 gwei)
    // gasPrice: "0x4A817C800", // default will use web3.eth.getGasPrice(), // 20000000000 (20 gwei)
    nonce: web3.utils.toHex(count), // default will use web3.eth.getTransactionCount()
    // chainId: 1, // default will use web3.eth.net.getId()
  }
  return contractInstance.methods.swapExactETHForTokens(
    options.swapExactETHForTokens.amountOutMin,
    options.swapExactETHForTokens.path,
    options.swapExactETHForTokens.to,
    options.swapExactETHForTokens.deadline
  ).send(contractOptions)
  .once('sending', function(payload){ console.log(payload) })
  .once('sent', function(payload){ console.log(payload) })
  .once('transactionHash', function(hash){ console.log(hash) })
  .once('receipt', function(receipt){ console.log(receipt) })
  .on('confirmation', function(confNumber, receipt, latestBlockHash){ console.log(confNumber);console.log(receipt);console.log(latestBlockHash); })
  .on('error', function(error){ console.log(error) })
}

const SwapExactTokensForETH = async (options) => {

  let web3 = new Web3(getNetworkEndpoint(options));
  web3.eth.accounts.wallet.add(web3.eth.accounts.privateKeyToAccount(options.privKey));

  const tokenContractInstanceAddress = web3.utils.toChecksumAddress(options.swapExactTokensForETH.tokenAddress);
  const tokenContractInstance = new web3.eth.Contract(contractDenarisAbi, tokenContractInstanceAddress);

  const contractInstanceAddress = web3.utils.toChecksumAddress(options.routerAddress);
  const contractInstance = new web3.eth.Contract(options.contractRouterAbi, contractInstanceAddress);

  const count = await web3.eth.getTransactionCount(options.from);

  // First, give allowance to router

  let contractOptions = {
    from: options.from,
    value: "0x00",
    gasLimit: "0x989680",
    gasPrice: "0x2540BE400", // default will use web3.eth.getGasPrice(), // 10000000000 (10 gwei)
    // gasPrice: "0x4A817C800", // default will use web3.eth.getGasPrice(), // 20000000000 (20 gwei)
    nonce: web3.utils.toHex(count), // default will use web3.eth.getTransactionCount()
    // chainId: 1, // default will use web3.eth.net.getId()
  }
  let res = await tokenContractInstance.methods.approve(
    options.routerAddress,
    options.swapExactTokensForETH.amountToken
  ).send(contractOptions);

  console.log(res);

  // Second, swap!

  contractOptions = {
    from: options.from,
    value: "0x00",
    gasLimit: "0x989680",
    gasPrice: "0x2540BE400", // default will use web3.eth.getGasPrice(), // 10000000000 (10 gwei)
    // gasPrice: "0x4A817C800", // default will use web3.eth.getGasPrice(), // 20000000000 (20 gwei)
    nonce: web3.utils.toHex(count+1), // default will use web3.eth.getTransactionCount()
    // chainId: 1, // default will use web3.eth.net.getId()
  }
  /* inputs
  [
    {"internalType":"uint256","name":"amountIn","type":"uint256"},
    {"internalType":"uint256","name":"amountOutMin","type":"uint256"},
    {"internalType":"address[]","name":"path","type":"address[]"},
    {"internalType":"address","name":"to","type":"address"},
    {"internalType":"uint256","name":"deadline","type":"uint256"}]
  */
  return contractInstance.methods.swapExactTokensForETH(
    options.swapExactTokensForETH.amountToken,
    web3.utils.toWei(options.swapExactTokensForETH.amountETHMin.toString()),
    options.swapExactTokensForETH.path,
    options.swapExactTokensForETH.to,
    options.swapExactTokensForETH.deadline
  ).send(contractOptions)
  // .once('sending', function(payload){ console.log(payload) })
  .once('sent', function(payload){ console.log(payload) })
  // .once('transactionHash', function(hash){ console.log(hash) })
  // .once('receipt', function(receipt){ console.log(receipt) })
  // .on('confirmation', function(confNumber, receipt, latestBlockHash){ console.log(confNumber);console.log(receipt);console.log(latestBlockHash); })
  // .on('error', function(error){ console.log(error) })
}

const GetAllowance = async (options) => {
  let web3 = new Web3(getNetworkEndpoint(options));
  web3.eth.accounts.wallet.add(web3.eth.accounts.privateKeyToAccount(options.privKey));

  const tokenContractInstanceAddress = web3.utils.toChecksumAddress(options.allowance.tokenAddress);
  const tokenContractInstance = new web3.eth.Contract(contractDenarisAbi, tokenContractInstanceAddress);

  return await tokenContractInstance.methods.allowance(options.from, options.allowance.spender).call();  
}

const AutomatePoolPair = async (options) => {
  // GetAllowance(options)
  try{
    await CreatePair(options);
  } catch(err) {
    console.log("Pair already exists");
  }
  let address = await GetPoolPairAddress(options);
  console.log(`Pair pool address: ${address}`);
  await AddLiquidityETH(options);
}

const SetFarmMinterRole = async (options) => {
  let web3 = new Web3(getNetworkEndpoint(options));
  web3.eth.accounts.wallet.add(web3.eth.accounts.privateKeyToAccount(options.privKey));

  const resourceContractInstanceAddress = web3.utils.toChecksumAddress(options.farmMinterRole.resourceAddress);
  const resourceContractInstance = new web3.eth.Contract(contractResourceAbi, resourceContractInstanceAddress);

  const count = await web3.eth.getTransactionCount(options.from);

  let contractOptions = {
    from: options.from,
    value: "0x00",
    gasLimit: "0x989680",
    gasPrice: "0x2540BE400", // default will use web3.eth.getGasPrice(), // 10000000000 (10 gwei)
    // gasPrice: "0x4A817C800", // default will use web3.eth.getGasPrice(), // 20000000000 (20 gwei)
    nonce: web3.utils.toHex(count), // default will use web3.eth.getTransactionCount()
    // chainId: 1, // default will use web3.eth.net.getId()
  }

  return resourceContractInstance.methods.grantRole(
    web3.utils.keccak256("MINTER_ROLE"),
    options.farmMinterRole.farmAddress,
  ).send(contractOptions)
  // .once('sending', function(payload){ console.log(payload) })
  .once('sent', function(payload){ console.log(payload) })
  // .once('transactionHash', function(hash){ console.log(hash) })
  // .once('receipt', function(receipt){ console.log(receipt) })
  // .on('confirmation', function(confNumber, receipt, latestBlockHash){ console.log(confNumber);console.log(receipt);console.log(latestBlockHash); })
  // .on('error', function(error){ console.log(error) })
}

const SetAllMinterRoles = async (options) => {
  for (const f of Object.keys(options.farmMinterRole.farms)){
    // for (const r of Object.keys(options.farmMinterRole.resources)){
      options.farmMinterRole.farmAddress=options.farmMinterRole.farms[f];
      options.farmMinterRole.resourceAddress=options.farmMinterRole.resources[f] // r;
      let res = await SetFarmMinterRole(options);
      console.log(res);
    // }
  }
}

const options = {
  blockchain: "binance", //"binance",
  network: "testnet", //"testnet",
  from: myAddress,
  to: testAddress,
  amount: 0,
  tokenAmount: 1000000,
  privKey: myPrivKey,
  factoryAddress: pancakeFactory, //pancakeFactory,
  routerAddress: pancakeRouter, //pancakeRouter,
  contractRouterAbi: contractUniswapV2Router02Abi, //contractUniswapV2Router02Abi || contractPancakeRouterAbi
  tokenA: denarisAddressTBNB, // denarisAddressTBNB - denarisAddressRinkeby,
  tokenB: wethAddress, // wbnbAddress - wethAddress
  allowance: {
    tokenAddress: denarisAddressTBNB, // denarisAddressTBNB - denarisAddressRinkeby,
    spender: pancakeRouter, // pancakeRouter
  },
  addLiquidityETH: {
    tokenAddress: denarisAddressTBNB, // denarisAddressTBNB - denarisAddressRinkeby,
    amountETH: 0.1, // (eth)
    amountToken: "1000000000000000000000", // (wei)
    amountTokenMin: "100000000000000000000",
    amountETHMin: 0.01,
    to: myAddress,
    deadline: Date.now() + 60*1000*60*24, // 1 day
  },
  removeLiquidityETH: {
    tokenAddress:  denarisAddressTBNB, // denarisAddressTBNB - denarisAddressRinkeby,
    amountLP: 2082440000000,
    amountTokenMin: 10000,
    amountETHMin: 0.0000000000000001,
    to: myAddress,
    deadline: Date.now() + 60*1000*60*24, // 1 day
  },
  swapExactETHForTokens: {
    amountETH: 0.01,
    amountOutMin: 100,
    // An array of token addresses. path.length must be >= 2. Pools for each consecutive pair of addresses must exist and have liquidity.
    path: [
      wethAddress, // wbnbAddress - wethAddress
      denarisAddressTBNB, // denarisAddressTBNB - denarisAddressRinkeby,
    ],
    to: myAddress,
    deadline: Date.now() + 60*1000*60*24, // 1 day
  },
  swapExactTokensForETH: {
    amountToken: 10000000000,
    amountETHMin: 0.0001,
    tokenAddress: denarisAddressTBNB,
    // An array of token addresses. path.length must be >= 2. Pools for each consecutive pair of addresses must exist and have liquidity.
    path: [
      denarisAddressTBNB, // denarisAddressTBNB - denarisAddressRinkeby,
      wethAddress, // wbnbAddress - wethAddress
    ],
    to: myAddress,
    deadline: Date.now() + 60*1000*60*24, // 1 day
  },
  farmMinterRole: {
    farmAddress: "",
    resourceAddress: "",
    farms: tBinanceFarms,
    resources: tBinanceResources,
  },
};

// GetAddressBalance(options)
// TransferDenaris(options)
// SendDenaris(options)
// GetAllowance(options)
// CreatePair(options)f
// GetPoolPairAddress(options) // 0x0a174f9cf22e991565e52243125629448C1d95b3
// AutomatePoolPair(options)
// AddLiquidityETH(options)
// RemoveLiquidityETH(options)
// SwapExactETHForTokens(options)
// SwapExactTokensForETH(options)
SetAllMinterRoles(options)
.then(console.log)
.catch(console.log);