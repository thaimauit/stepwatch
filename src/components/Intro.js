import React, { useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ImageAssets } from 'src/assets';
import Device from '../utils/Device';
import Video from 'react-native-video';

const createAnimation = (value, duration, easing, delay = 0) => {
  return Animated.timing(value, {
    toValue: 1,
    duration,
    easing,
    delay,
  });
};

const Intro = props => {
  const { onShowApp } = props;

  useEffect(() => {
    // setTimeout(() => {
    //   animate();
    // }, 500);

    setTimeout(() => {
      onShowApp();
    }, 2000);
  }, [onShowApp]);

  // const animate = useCallback(() => {
  //   animatedValue1.current.setValue(0);
  //   animatedValue2.current.setValue(0);
  //   animatedValue3.current.setValue(0);

  //   Animated.parallel([
  //     createAnimation(animatedValue1.current, 500, Easing.ease),
  //     createAnimation(animatedValue2.current, 500, Easing.ease, 500),
  //     createAnimation(animatedValue3.current, 500, Easing.ease, 1000),
  //   ]).start();
  // }, []);

  // const scalePerson = animatedValue1.current.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: [0, 1],
  // });
  // const scaleName = animatedValue2.current.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: [0, 1],
  // });
  // const locationImgLeft = animatedValue3.current.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: [
  //     -Device.screenWidth * 0.3,
  //     (Device.screenWidth - Device.screenWidth * 0.3) / 2,
  //   ],
  // });

  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/intro-APP.m4v')} // Can be a URL or a local file.
        //  ref={}                                      // Store reference
        // onBuffer={this.onBuffer} // Callback when remote video is buffering
        // onError={this.videoError} // Callback when video cannot be loaded
        style={styles.video}
        resizeMode="contain"
      />
    </View>
  );

  // return (
  //   <View style={styles.container}>
  //     <Image style={styles.background} source={ImageAssets.background} />
  //     <SafeAreaView style={styles.content}>
  //       <View style={styles.top}>
  //         <View style={styles.locationIconWrapper}>
  //           <Animated.View
  //             style={[styles.locationView, { left: locationImgLeft }]}>
  //             <Image
  //               source={ImageAssets.introLocation}
  //               style={styles.locationIcon}
  //               resizeMode="contain"
  //             />
  //           </Animated.View>
  //         </View>
  //         <Animated.Image
  //           style={[
  //             {
  //               transform: [{ scale: scaleName }],
  //             },
  //             styles.logo,
  //           ]}
  //           resizeMode="contain"
  //           source={ImageAssets.logo}
  //         />
  //       </View>

  //       <View style={styles.personWrapper}>
  //         <Animated.Image
  //           style={{
  //             transform: [{ scale: scalePerson }],
  //             width: Device.screenWidth * 0.5,
  //             height: 0.6 * Device.screenHeight,
  //           }}
  //           resizeMode="contain"
  //           source={ImageAssets.introPart1}
  //         />
  //       </View>
  //     </SafeAreaView>
  //   </View>
  // );
};

Intro.propTypes = {};

export default React.memo(Intro);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  // background: {
  //   width: '100%',
  //   height: '100%',
  // },
  // content: {
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   bottom: 0,
  //   right: 0,
  // },
  // locationIconWrapper: {
  //   height: 50,
  // },
  // locationView: {
  //   width: 0.3 * Device.screenWidth,
  //   alignItems: 'center',
  //   position: 'absolute',
  //   left: -0.3 * Device.screenWidth,
  //   top: 0,
  // },
  // locationIcon: {
  //   width: 50,
  //   height: 50,
  // },
  // top: {
  //   flex: 1,
  //   justifyContent: 'center',
  // },
  // logo: {
  //   width: '60%',
  //   alignSelf: 'center',
  //   height: 100,
  // },
  // personWrapper: {
  //   width: '100%',
  //   alignItems: 'center',
  // },
});
