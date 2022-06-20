import apis from './apis';
import request from './request';

export const submitRunning = params =>
  request(apis.run.submit, { method: 'POST', body: params });

export const estimateRunning = params =>
  request(apis.run.estimate, { method: 'POST', body: params });
