import CryptoJS from 'crypto-js';
import { utils } from 'ethers';

export const formatPIN = pin => {
  return utils.sha256(utils.toUtf8Bytes(pin)).substring(0, 16);
};

export const encrypt = (plainText, pin) => {
  const key = formatPIN(pin);
  return CryptoJS.AES.encrypt(plainText, key).toString();
};

export const decrypt = (encode, pin) => {
  const key = formatPIN(pin);
  var bytes = CryptoJS.AES.decrypt(encode, key);
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};
