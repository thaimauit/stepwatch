const wallet = {
  fundings: 'v1/wallet/balances',
  withdraw: 'v1/wallet/withdraw',
};

const user = {
  login: 'v1/user/login',
  register: 'v1/user/register',
  requestRegisterCode: (email, recaptcha) =>
    `v1/user/send-register-otp?email=${email}&recaptcha=${recaptcha}`,
  userProfile: 'v1/user/profile',
  updateRefId: (id, isSkip) =>
    `v1/user/invitation-code?invitationCode=${id}&skipReferral=${
      isSkip ? 'true' : 'false'
    }`,
  ga: 'v1/user/ga',
  changePassword: 'v1/user/password',
  forgotPass: {
    sendRequest: (email, recaptcha) =>
      `v1/user/send-reset-password-otp?email=${email}&recaptcha=${recaptcha}`,
    resetPassword: 'v1/user/reset-password',
  },
  walletAddress: address => `v1/user/address?address=${address}`,
};

const nft = {
  listBaseNft: 'v1/nft/list-base-nfts',
  myNfts: 'v1/watch/my-watches',
  myBoxs: 'v1/box/my-boxes',
  repair: id => `v1/watch/repair?watchId=${id}`,
  nftDetail: (id, isBox) =>
    isBox ? `v1/box?boxId=${id}` : `v1/watch?watchId=${id}`,
  unBox: id => `v1/box/unbox?boxId=${id}`,
};

const run = {
  submit: 'v1/run/submit',
  estimate: 'v1/run/estimate',
};

const system = {
  constants: 'v1/system/settings',
  networks: 'v1/system/networks',
};

export default {
  wallet,
  user,
  nft,
  run,
  system,
};
