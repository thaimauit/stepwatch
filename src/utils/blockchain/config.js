const { ethers } = require('ethers');
// const abi = require('./abi');

module.exports = {
  PANCAKE_ROUTER_ADDRESS: '0xD99D1c33F9fC3444f8101754aBC46c52416550D1',
  INIT_SLIPPAGE_TOLERANCE_PERCENT: '50',
  TOTAL_PERCENT: '10000',
  // ABI_ERC20: abi.ABI_ERC20,
  // ABI_ERC721: abi.ABI_ERC721_CUSTOM,
  // ABI_MARKETPLACE: abi.ABI_MARKETPLACE,
  PROVIDER: new ethers.providers.JsonRpcProvider(
    'https://data-seed-prebsc-1-s1.binance.org:8545/',
  ),
  ARR_ERC20_SUPPORTED: [
    {
      name: 'Topexcoin',
      symbol: 'TPP',
      decimals: 18,
      address: '0x8559e768764D56F4d6F578E91cA0fdD2D70B20cb',
    },
  ],
  ARR_ERC721_SUPPORTED: ['0x8727C33Bdf6Cf875f33a3E63dCf31672528fE795'],
  LISTING_INFO: {
    types: {
      Detail: [
        {
          name: 'tokenId',
          type: 'uint256',
        },
        {
          name: 'tokenContract',
          type: 'address',
        },
        {
          name: 'price',
          type: 'uint256',
        },
        {
          name: 'decimals',
          type: 'uint256',
        },
        {
          name: 'paymentContract',
          type: 'address',
        },
        {
          name: 'foundationFeePercent',
          type: 'uint256',
        },
      ],
    },
    domain: {
      name: 'SIGN FOR SELL',
      version: '1',
      chainId: 97,
      verifyingContract: '0x33d571644c231f599897B9b83CD11A6949C5D622',
    },
  },
};
