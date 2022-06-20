import { utils } from 'ethers';

export const isValidSHA256 = str => {
  // Regular expression to check if string is a SHA256 hash
  const regexExp = /^[a-f0-9]{64}$/gi;
  return regexExp.test(str);
};

export const isValidMnemonic = mnemonic => utils.isValidMnemonic(mnemonic);

export const parseEthereumError = exception => {
  let objErr = {};
  let errorMessage = exception.toString();
  if (exception.tx) {
    objErr = JSON.parse(exception.error.error.body);
    errorMessage = objErr.error.message;
  } else if (exception.method && !exception.errorArgs)
    if (exception.error) {
      objErr = JSON.parse(exception.error.body);
      errorMessage = objErr.error.message;
    } else errorMessage = '[Smartcontract check] Address not found on chain';
  else if (
    exception.argument ||
    exception.errorArgs ||
    exception.requestBody ||
    exception.code
  )
    if (exception.argument || exception.requestBody || exception.code)
      errorMessage = `[Blockchain format check] ${exception.reason}`;
    else errorMessage = `[Smartcontract check] Error at ${exception.reason}`;
  else if (Object.keys(exception).length === 0)
    errorMessage = `[Self check] ${errorMessage}`;
  else errorMessage = 'Unknown error';

  const modifyErrorMessage = errorMessage.replace(
    'execution reverted:',
    '[Smartcontract check] Error at',
  );
  return modifyErrorMessage;
};

// export const formatPIN = pin => {
//   return utils.sha256(utils.toUtf8Bytes(pin)).substring(0, 16).split('');
// };
// // The initialization vector (must be 16 bytes)
// var iv = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];

// export const encryptAes = (value = 'dsdsdsdddddddddd', pin) => {
//   // const key = formatPIN(pin);
//   var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
//   var text = value;
//   var textBytes = aesjs.utils.utf8.toBytes(text);

//   var aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
//   var encryptedBytes = aesCbc.encrypt(textBytes);

//   // To print or store the binary data, you may convert it to hex
//   var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
//   return encryptedHex;
// };

// export const decryptAes = (hex, pin) => {
//   const key = formatPIN(pin);
//   // When ready to decrypt the hex string, convert it back to bytes
//   var encryptedBytes = aesjs.utils.hex.toBytes(hex);

//   // The cipher-block chaining mode of operation maintains internal
//   // state, so to decrypt a new instance must be instantiated.
//   var aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
//   var decryptedBytes = aesCbc.decrypt(encryptedBytes);

//   // Convert our bytes back into text
//   var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
//   return decryptedText;
// };

export const formatAddress = address => {
  if (!address) return '';
  const part1 = address.substring(0, 5);
  const part2 = address.substring(15);
  return `${part1}....${part2}`;
};

// export const checkValidERC20 = (symbol) => {
//   const ERC20 = config.ARR_ERC20_SUPPORTED.find(token => token.symbol === symbol);
//   if (!ERC20) throw Error("ERC20 not supported!")
//   return ERC20
// }
