import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { Text } from 'src/components';
import { ImageAssets } from 'src/assets';
import constants from 'src/constants';

const DownloadApp = props => {
  const downLoadAppleGa = useCallback(() => {
    Linking.openURL(constants.common.GA_APPLE_LINKING);
  }, []);

  const downLoadGoogleGa = useCallback(() => {
    Linking.openURL(constants.common.GA_GOOGLE_LINKING);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title} color="#fff">
        {'Download and install the Google Authenticator app'}
      </Text>
      <View style={styles.linkContainer}>
        <TouchableOpacity style={styles.link} onPress={downLoadAppleGa}>
          <Image
            source={ImageAssets.appleLink}
            style={styles.linkImg}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.link} onPress={downLoadGoogleGa}>
          <Image
            source={ImageAssets.googleLink}
            style={styles.linkImg}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default React.memo(DownloadApp);

DownloadApp.propTypes = {};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    textAlign: 'center',
  },
  linkContainer: {
    // justifyContent: 'space-between',
    flexDirection: 'row',
  },
  link: {
    marginBottom: 20,
    flex: 1,
    alignItems: 'center',
  },
  linkImg: {
    width: '90%',
  },
});
