const axios = require('axios');
const { default: Logger } = require('../Logger');

const BASE_URI = 'http://localhost:4000';

exports.getUSDPerNative = () => {
  return axios
    .get('https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=USD')
    .then(rs => rs.data.USD)
    .catch(error => {
      Logger.info('Error at getUSDPerNative');
      Logger.info(error);
    });
};

exports.getAllNftOwner = (ERC721Address, ownerAddress) => {
  return axios
    .get(`${BASE_URI}/api/v1/get-all-nft-owner`, {
      params: {
        erc721_address: ERC721Address,
        owner_address: ownerAddress,
      },
    })
    .then(rs => {
      if (!rs.data.status) throw Error('getAllNftOwner failed casuse status 0');
      return rs.data.result;
    })
    .catch(error => {
      Logger.info('Error at getUSDPerNative');
      Logger.info(error);
    });
};

exports.getOrderInput = async body => {
  return axios
    .post(`${BASE_URI}/api/v1/get-order-input`, body)
    .then(rs => {
      if (!rs.data.status) throw Error('getOrderInput failed casuse status 0');
      return rs.data.result.input_encode;
    })
    .catch(error => {
      Logger.info(error);
    });
};
