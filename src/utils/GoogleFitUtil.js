import GoogleFit, { Scopes } from 'react-native-google-fit';
import { PermissionsAndroid } from 'react-native';
import { get } from 'lodash';
import { useCallback } from 'react';

const OPTIONS = {
  scopes: [
    // Scopes.FITNESS_ACTIVITY_READ,
    // Scopes.FITNESS_ACTIVITY_READ,
    // Scopes.FITNESS_ACTIVITY_WRITE,
    // Scopes.FITNESS_BODY_READ,
    // Scopes.FITNESS_BODY_WRITE,
  ],
};

export const isAuthorized = GoogleFit.isAuthorized;

export const stopStepTracking = () => {
  GoogleFit.removeListeners();
};

export const startStepTracking = async callback => {
  try {
    const granted = await PermissionsAndroid.request(
      'android.permission.ACTIVITY_RECOGNITION',
      {
        title: 'Permission require',
        message: 'Permission require',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.DENIED)
      return { success: false, error: 'Permission denied' };

    const { success } = await GoogleFit.authorize(OPTIONS);
    if (!success)
      return {
        success: false,
        message: 'Google Fit denied',
      };

    GoogleFit.startRecording(() => {});
    GoogleFit.observeSteps(result => {
      callback(get(result, 'steps', 0));
    });
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
};
