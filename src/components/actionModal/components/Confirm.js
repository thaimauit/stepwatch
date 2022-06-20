// import React, { useCallback } from 'react';
// import { View, StyleSheet, TouchableOpacity } from 'react-native';
// import PropTypes from 'prop-types';
// import theme from 'src/theme';
// import { Icon } from '../../Icon';
// import Text from '../../Text';
// import Button from '../../Button';

// const Confirm = props => {
//   const {
//     title,
//     content,
//     onSubmit,
//     onClose,
//     cancelTitle,
//     submitTitle,
//     contentStyle,
//   } = props;

//   const handleSubmit = useCallback(() => {
//     onSubmit({ data: true });
//   }, [onSubmit]);

//   const cancelText =
//     cancelTitle || 'Cancel';
//   const submitText = submitTitle || Locales.locale(Locales.Scopes.common.ok);

//   return (
//     <View style={styles.content}>
//       <View style={styles.header}>
//         <View style={styles.headerSide} />
//         <Text style={styles.title} secondary>
//           {title}
//         </Text>
//         <TouchableOpacity style={styles.headerSide} onPress={onClose}>
//           <Icon name="close" color="#000" sise={20} />
//         </TouchableOpacity>
//       </View>
//       <View style={styles.contentBody}>
//         <Text secondary style={[styles.contentMessage, contentStyle]}>
//           {content}
//         </Text>
//       </View>
//       <View style={styles.footer}>
//         <Button
//           style={styles.footerButton}
//           title={cancelText}
//           titleStyle={styles.cancelTitle}
//           onPress={onClose}
//           transparent
//         />
//         <View style={styles.separator} />
//         <Button
//           style={styles.footerButton}
//           title={submitText}
//           titleStyle={styles.submitTitle}
//           onPress={handleSubmit}
//           transparent
//         />
//       </View>
//     </View>
//   );
// };
// export default React.memo(Confirm);

// Confirm.propTypes = {
//   cancelTitle: PropTypes.string,
//   submitTitle: PropTypes.string,
//   title: PropTypes.string,
//   content: PropTypes.string,
//   onClose: PropTypes.func,
//   onSubmit: PropTypes.func,
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   content: {
//     width: '80%',
//     borderRadius: 10,
//     backgroundColor: '#fff',
//   },
//   header: {
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   title: {
//     textAlign: 'center',
//     fontWeight: '600',
//     fontSize: 17,
//     flex: 1,
//     marginTop: 5,
//   },
//   headerSide: {
//     width: 50,
//     alignItems: 'center',
//     paddingBottom: 10,
//     paddingTop: 15,
//   },
//   contentBody: {
//     padding: 10,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   contentMessage: {
//     fontSize: 15,
//     textAlign: 'center',
//   },
//   footer: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//   },
//   footerButton: {
//     flex: 1,
//     alignItems: 'center',
//     paddingVertical: 10,
//   },
//   separator: {
//     height: 32,
//     width: 1,
//     backgroundColor: 'rgba(0,0,0,0.1)',
//     opacity: 0.5,
//   },
//   cancelTitle: {
//     fontSize: 15,
//     color: theme.colors.text.secondary,
//     fontWeight: '400',
//   },
//   submitTitle: {
//     color: theme.colors.button.primary,
//     fontSize: 15,
//     fontWeight: '600',
//   },
// });
