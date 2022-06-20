import apis from './apis';
import request from './request';

export const login = params => {
  return request(apis.user.login, {
    method: 'POST',
    body: params,
  });
};
export const requestRegisterCode = (email, recaptcha) => {
  return request(apis.user.requestRegisterCode(email, recaptcha), {
    method: 'POST',
    body: {},
  });
};
export const register = params => {
  return request(apis.user.register, {
    method: 'POST',
    body: params,
  });
};

export const getProfile = () => {
  return request(apis.user.userProfile);
};

export const updateRefId = (id, isSkip) => {
  return request(apis.user.updateRefId(id, isSkip), {
    method: 'PUT',
    body: {},
  });
};

export const updateProfile = params => {
  return request(apis.user.userProfile, { method: 'PUT', body: params });
};

export const generateGAQRCode = () => {
  return request(apis.user.ga);
};

export const updateGA = params => {
  return request(apis.user.ga, { method: 'PUT', body: params });
};

export const changePassword = (oldPass, newPass) => {
  return request(apis.user.changePassword, {
    method: 'PUT',
    body: { oldPassword: oldPass, password: newPass },
  });
};

export const forgotPassSendRequest = (email, recaptcha) => {
  return request(apis.user.forgotPass.sendRequest(email, recaptcha), {
    method: 'POST',
  });
};

export const forgotPassResetPassword = params => {
  return request(apis.user.forgotPass.resetPassword, {
    method: 'PUT',
    body: params,
  });
};

export const updateWalletAddress = address => {
  return request(apis.user.walletAddress(address), { method: 'PUT' });
};
