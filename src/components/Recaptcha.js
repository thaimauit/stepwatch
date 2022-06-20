// import React, { forwardRef, useImperativeHandle, useRef } from 'react';
// import { View, StyleSheet } from 'react-native';
// import PropTypes from 'prop-types';
// import Recaptcha from 'react-native-recaptcha-that-works';
// import ReCaptcha from '@haskkor/react-native-recaptchav3';
// import Config from 'react-native-config';

// const RecaptchaV3 = forwardRef((props, ref) => {
//   const { onReceiveToken } = props;
//   const recaptcha = useRef();

//   useImperativeHandle(
//     ref,
//     () => ({
//       refresh: () => {
//         recaptcha.current.refreshToken();
//       },
//     }),
//     [],
//   );

//   return (
//     <ReCaptcha
//       ref={recaptcha}
//       captchaDomain={Config.CAPTCHA_DOMAIN}
//       siteKey={Config.CAPTCHA_SITE_KEY}
//       onReceiveToken={onReceiveToken}
//     />
//   );
// });

// RecaptchaV3.propTypes = {
//   onReceiveToken: PropTypes.func.isRequired,
// };

// export default React.memo(RecaptchaV3);

// const styles = StyleSheet.create({
//   container: {},
//   loadingView: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 100,
//     height: 100,
//   },
// });
