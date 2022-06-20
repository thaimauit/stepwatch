import { generateMnemonic as genMnemonic, mnemonicToSeedSync } from 'bip39';
import { utils } from 'ethers';
import Logger from '../Logger';
import { encrypt } from './aes';
const { isValidMnemonic, isValidSHA256 } = require('./utils');

export const formatPath = "m/44'/60'/0'/0/";

// return new mnemonic
export const generateMnemonic = () => genMnemonic();

// return input of Account class
export const createAccount = (mnemonic, pin) => {
  const hd = utils.HDNode.fromSeed(mnemonicToSeedSync(mnemonic));
  const path = formatPath.concat('0');
  const hdNode = hd.derivePath(path);
  const privateKey = pin ? encrypt(hdNode.privateKey, pin) : hdNode.privateKey;
  const enccryptMnemonic = pin ? encrypt(mnemonic, pin) : mnemonic;
  if (hdNode) {
    const account = {
      privateKey,
      path,
      name: 'Account 0',
      mnemonic: enccryptMnemonic,
      address: hdNode.address,
    };
    return account;
  }
  return null;
};

// return input of Account class
export const importMnemonic = mnemonic => {
  if (isValidMnemonic(mnemonic)) return createAccount(mnemonic);

  return null;
};

// return input of Account class
// const importAccount = privateKey => {
//   if (isValidSHA256(privateKey)) {
//     const account = {
//       privateKey: privateKey,
//       path: null,
//       name: `Account ${saved.ARR_ACCOUNT.length}`,
//     };
//     saved.ARR_ACCOUNT.push(account);
//     return account;
//   }
//   return null;
// };
