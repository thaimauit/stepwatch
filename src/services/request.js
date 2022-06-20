import { get, isEmpty } from 'lodash';
import Config from 'react-native-config';
import { store } from 'src/redux';
import { actions } from 'src/models';
import Logger from '../utils/Logger';

export const Methods = {
  POST: 'POST',
  GET: 'GET',
  PUT: 'PUT',
};

let accessToken = '';

export const setToken = token => (accessToken = token);

export default async function request(
  endpoint,
  { body = {}, options = {}, newOptions, method = 'GET', isFormData } = {},
) {
  try {
    // Logger.info(accessToken);
    if (!endpoint) return { success: false, message: 'Missing endpoint' };
    Logger.info(`request ${Config.API}${endpoint}`, {
      body: JSON.stringify(body),
      method,
      token: accessToken,
    });
    const response = await fetch(`${Config.API}${endpoint}`, {
      method,
      ...(!isEmpty(body)
        ? {
            body: isFormData ? body : JSON.stringify(body),
          }
        : {}),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        ...options,
        ...(newOptions ? newOptions : { 'Content-Type': 'application/json' }),
      },
    });
    const { status } = response;
    if (status === 401 || status === 403) {
      Logger.info('Request error', { endpoint, data, status });
      store.dispatch(actions.profile.logout());
      // TODO: logout
      return {
        success: false,
        status,
      };
    }

    console.log(response);

    const data = await response.json();
    if (data) {
      const { success, error } = data;
      Logger.info('Request response', { endpoint, data, status });

      if (!success) Logger.info('Request Error', { error, endpoint, status });
      return { ...data, status, error };
    }
    return {
      success: status === 200,
    };
  } catch (error) {
    Logger.info(`CALL API fail at ${endpoint}`, error);
    return {
      success: false,
      error,
    };
  }
}
