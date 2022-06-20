import apis from './apis';
import request from './request';

export const getConstants = () => request(apis.system.constants);

export const getNetworks = () => request(apis.system.networks);
