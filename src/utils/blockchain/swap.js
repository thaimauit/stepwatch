const ethers = require('ethers');
const {
  Fetcher,
  WETH,
  Token,
  Route,
  Trade,
  TokenAmount,
  TradeType,
  Percent,
} = require('@pancakeswap/sdk');
const { utils, BigNumber, constants } = ethers;
const config = require('./config');
const { default: Logger } = require('../Logger');

class Swap {
  #slippageTolerancePercent;
  #trade;
  #upToken;
  #downToken;
  #providerURL;

  constructor(tokens, providerURL) {
    this.#providerURL = providerURL;
    Logger.info('tokens', tokens);
    tokens.forEach(token => {
      if (token.contractAddress === constants.AddressZero)
        this[token.asset] = WETH[token.chainId];
      else
        this[token.asset] = new Token(
          token.chainId,
          token.contractAddress,
          token.decimals,
          token.asset,
          token.name,
        );
    });
  }

  getMinOutAmount(currencyAmount) {
    const amountOutMin = currencyAmount.raw.toString();
    const decimals = Number(currencyAmount.token.decimals);
    return parseFloat(
      utils.formatUnits(BigNumber.from(amountOutMin), decimals),
    ).toFixed(2);
  }

  setSlippageTolerancePercent = async percent => {
    const parePercent = Number(percent) * 100;
    if (parePercent > 5000)
      throw Error('Slippage tolerance percent must less than or equal to 50% ');
    this.#slippageTolerancePercent = new Percent(
      parePercent.toString(),
      config.TOTAL_PERCENT,
    );
    return this.getTrade();
  };

  setTrade = async (upTokenSymbol, upTokenAmount, downTokenSymbol, percent) => {
    const parePercent = Number(percent) * 100;
    this.#slippageTolerancePercent = new Percent(
      parePercent.toString(),
      config.TOTAL_PERCENT,
    );
    const pair = await Fetcher.fetchPairData(
      this[upTokenSymbol],
      this[downTokenSymbol],
      new ethers.providers.JsonRpcProvider(this.#providerURL),
    );
    const route = new Route([pair], this[upTokenSymbol]);
    upTokenAmount = utils
      .parseUnits(
        upTokenAmount.toString(),
        Number(this[upTokenSymbol].decimals),
      )
      .toString();
    this.#trade = new Trade(
      route,
      new TokenAmount(this[upTokenSymbol], upTokenAmount),
      TradeType.EXACT_INPUT,
    );
    this.#upToken = upTokenSymbol;
    this.#downToken = downTokenSymbol;
    return this.getTrade();
  };

  getTrade = () => {
    const minimumOutAmount = this.getMinOutAmount(
      this.#trade.minimumAmountOut(this.#slippageTolerancePercent),
    );
    const inAmount = this.#trade.inputAmount.toSignificant(6);
    const outAmount = this.#trade.outputAmount.toSignificant(6);
    const priceImpact = this.#trade.priceImpact.toSignificant(2);
    const down_upPrice = this.#trade.executionPrice.toSignificant(6);
    const up_downPrice = this.#trade.executionPrice.invert().toSignificant(6);
    return {
      slippageTolerance: this.#slippageTolerancePercent.toSignificant(2),
      minimumOutAmount,
      inAmount,
      outAmount,
      priceImpact,
      down_upPrice,
      up_downPrice,
    };
  };

  getInputSwap = signerAddress => {
    const amountOutMin = this.#trade
      .minimumAmountOut(this.#slippageTolerancePercent)
      .raw.toString();
    const path = [this[this.#upToken].address, this[this.#downToken].address];
    const to = signerAddress;
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
    const value = this.#trade.inputAmount.raw.toString();
    return {
      isUpNativeToken:
        this[this.#upToken].address ===
        WETH[this[this.#upToken].chainId].address
          ? true
          : false,
      isDownNativeToken:
        this[this.#downToken].address ===
        WETH[this[this.#downToken].chainId].address
          ? true
          : false,
      amountOutMin,
      path,
      to,
      deadline,
      value,
    };
  };

  getInputSwap = signerAddress => {
    const amountOutMin = this.#trade
      .minimumAmountOut(this.#slippageTolerancePercent)
      .raw.toString();
    const path = [this[this.#upToken].address, this[this.#downToken].address];
    const to = signerAddress;
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
    const value = this.#trade.inputAmount.raw.toString();
    return {
      isUpNativeToken:
        this[this.#upToken].address ===
        WETH[this[this.#upToken].chainId].address
          ? true
          : false,
      isDownNativeToken:
        this[this.#downToken].address ===
        WETH[this[this.#downToken].chainId].address
          ? true
          : false,
      amountOutMin,
      path,
      to,
      deadline,
      value,
    };
  };
}

module.exports = Swap;
