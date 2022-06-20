const { ethers, utils, BigNumber, constants } = require('ethers');
const _ = require('lodash');
import Logger from '../Logger';
import abi from './abi';
import config from './config';

class Account {
  #signer;
  #provider;
  constructor({ privateKey, name, provider }) {
    this.#signer = new ethers.Wallet(privateKey, provider);
    this.name = name;
    this.address = this.#signer.address;
    this.#provider = provider;
  }

  getAccountAddress = () => this.address;

  getTokenBalance = async token => {
    const contractInstance = new ethers.Contract(
      token.contractAddress,
      abi.ABI_ERC20,
      this.#signer,
    );
    const balanceERC20 = await contractInstance.balanceOf(this.address);
    return utils.formatUnits(balanceERC20, token.decimals);
  };

  // get BNB balance
  getNativeBalance = async () => {
    try {
      // const USDPerNative = await api.getUSDPerNative();
      const nativeBalance = utils.formatUnits(await this.#signer.getBalance());
      return {
        native: nativeBalance,
        // USD: nativeBalance * USDPerNative,
      };
    } catch (e) {
      // console.log(e);
    }
  };

  getChainId = () => {
    return this.#signer.provider._network.chainId;
  };

  getArrTokenBalance = async (tokensList = []) => {
    return Promise.all(
      tokensList.map(async token => {
        const tokenData = { ...token };
        if (token.asset === 'BNB')
          tokenData.balance = utils.formatUnits(
            await this.#signer.getBalance(),
          );
        else tokenData.balance = await this.getTokenBalance(tokenData);

        return tokenData;
      }),
    );
  };

  swapTrade = async inputSubmit => {
    const gasPrice = await this.#provider.getGasPrice();
    const pancakeswap = new ethers.Contract(
      config.PANCAKE_ROUTER_ADDRESS,
      abi.ABI_PANCAKE_ROUTER,
      this.#signer,
    );
    const tx =
      inputSubmit.isUpNativeToken === true
        ? await pancakeswap.swapExactETHForTokens(
            inputSubmit.amountOutMin,
            inputSubmit.path,
            inputSubmit.to,
            inputSubmit.deadline,
            { value: inputSubmit.value, gasPrice },
          )
        : inputSubmit.isDownNativeToken === true
        ? await pancakeswap.swapExactTokensForETH(
            inputSubmit.value,
            inputSubmit.amountOutMin,
            inputSubmit.path,
            inputSubmit.to,
            inputSubmit.deadline,
            { gasPrice },
          )
        : await pancakeswap.swapExactTokensForTokens(
            inputSubmit.value,
            inputSubmit.amountOutMin,
            inputSubmit.path,
            inputSubmit.to,
            inputSubmit.deadline,
            { gasPrice },
          );
    return this.getReceiptFromTxHash(tx.hash);
  };

  // get transaction receipt by txHash
  getReceiptFromTxHash = txHash => {
    return new Promise(async (resolve, reject) => {
      try {
        const receipt = await this.#provider.waitForTransaction(txHash);
        // If status = 1 is success
        if (receipt.status === 1) {
          const gasPrice = await this.#provider.getGasPrice();
          // Get real gas used
          const realGasUsed = utils.formatEther(receipt.gasUsed.mul(gasPrice));
          // Set data return to object dataResult
          const dataResult = {
            txHash: receipt.transactionHash,
            txFee: realGasUsed,
            isSuccess: true,
          };
          resolve(dataResult);
        }
        resolve({ isSuccess: false });
      } catch (error) {
        reject(error);
      }
    });
  };
  static isValidApproveBalance = async (
    ERC20Symbol,
    signerAddress,
    approveTo,
    amountReadable,
    tokenList,
    provider,
  ) => {
    const ERC20 = tokenList.find(({ asset }) => asset === ERC20Symbol);
    if (!ERC20) return false;
    if (ERC20.contractAddress === constants.AddressZero) {
      Logger.info('signerAddress', signerAddress);
      const balance = await provider.getBalance(signerAddress);
      Logger.info('balance', balance);
      return balance.gte(
        utils.parseEther((Number(amountReadable) + 0.01).toString()),
      )
        ? true
        : false;
    } else {
      const contractInstance = new ethers.Contract(
        ERC20.contractAddress,
        abi.ABI_ERC20,
        config.PROVIDER,
      );
      const [allowance, balance] = await Promise.all([
        contractInstance.allowance(signerAddress, approveTo),
        contractInstance.balanceOf(signerAddress),
      ]);
      return allowance.gte(
        utils.parseUnits(Number(amountReadable).toString(), ERC20.decimals),
      ) &&
        balance.gte(
          utils.parseUnits(Number(amountReadable).toString(), ERC20.decimals),
        )
        ? true
        : false;
    }
  };

  // Transfer
  transferERC20 = async (
    isEstimate,
    tokenList,
    ERC20Symbol,
    toAddress,
    amountReadable,
  ) => {
    // const ERC20 = checkValidERC20(ERC20Symbol)
    const ERC20 = tokenList.find(({ asset }) => asset === ERC20Symbol);
    const contractInstance = new ethers.Contract(
      ERC20.contractAddress,
      abi.ABI_ERC20,
      this.#signer,
    );
    const options = { gasPrice: await this.#provider.getGasPrice() };
    const amount = utils.parseUnits(
      Number(amountReadable).toString(),
      ERC20.decimals,
    );

    if (isEstimate) {
      let gasEstimate = null;
      if (ERC20.contractAddress === constants.AddressZero)
        gasEstimate = await config.PROVIDER.estimateGas({
          to: toAddress,
          value: amount,
          ...options,
        });
      else
        gasEstimate = await contractInstance.estimateGas.transfer(
          toAddress,
          amount,
          options,
        );

      if (!gasEstimate) throw Error('Execute estimate transfer failed!');
      const estimateGasUsed = utils.formatEther(
        gasEstimate.mul(options.gasPrice),
      );
      return estimateGasUsed;
    } else {
      let tx = null;
      if (ERC20.contractAddress === constants.AddressZero)
        tx = await this.#signer.sendTransaction({
          to: toAddress,
          value: amount,
          ...options,
        });
      else tx = await contractInstance.transfer(toAddress, amount, options);

      console.log('tx: ', tx);
      if (!tx) throw Error('Execute transfer failed!');
      return this.getReceiptFromTxHash(tx.hash);
    }
  };
}

export default Account;
