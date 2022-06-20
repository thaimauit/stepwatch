import { Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const { width, height } = Dimensions.get('window');

const getAppVersion = () => DeviceInfo.getVersion();

export default {
  screenWidth: width,
  screenHeight: height,
  getAppVersion,
};
