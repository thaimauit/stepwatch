import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image as RNImage,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import theme from 'src/theme';
import { ImageAssets } from 'src/assets';
import { actions, selectors } from 'src/models';
import constants from 'src/constants';
import Text from '../Text';
import Image from '../Image';
import Loading from '../Loading';

const HEADER_TOKENS = { SWE: 'swe', SWP: 'swp', MATIC: 'matic' };

const TabHeader = props => {
  const { navigation } = props;
  const { top } = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const fundings = useSelector(selectors.wallet.fundings);
  const timer = useRef();

  useEffect(() => {
    init();
  }, [init]);

  const init = useCallback(() => {
    timer.current = setInterval(() => {
      fetchData();
    }, 16000);
  }, [fetchData]);

  const fetchData = useCallback(() => {
    setLoading(true);
    dispatch(
      actions.wallet.getFundingWallet(() => {
        setLoading(false);
      }),
    );
  }, [dispatch]);

  const paddingTop = useMemo(() => (top > 25 ? top - 10 : 15), [top]);

  const openAccountDrawer = useCallback(() => {
    navigation.navigate(constants.screens.PROFILE);
  }, [navigation]);

  const openWalletDrawer = useCallback(() => {
    navigation.navigate(constants.screens.WALLET);
  }, [navigation]);

  const renderToken = useCallback(token => {
    if (!HEADER_TOKENS[token.asset]) return <View key={token.asset} />;
    return (
      <View style={styles.tokenView} key={token.asset}>
        <RNImage
          source={ImageAssets.tokens[token.asset.toLowerCase()]}
          style={styles.tokenImg}
        />
        <Text size={10} color="#fff">{` ${token.amount}`}</Text>
      </View>
    );
  }, []);

  return (
    <View style={[styles.container, { paddingTop }]}>
      <TouchableOpacity style={styles.avatarView} onPress={openAccountDrawer}>
        <RNImage source={ImageAssets.iconAcc} style={styles.avatar} />
        {/* <View style={styles.distanceWrapper}>
          <View style={styles.distanceView}>
            <Text size={10}>0.0km</Text>
          </View>
        </View> */}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.spendWalletView}
        onPress={openWalletDrawer}>
        {fundings.map(renderToken)}
        <Image source={ImageAssets.polygon} style={styles.bepIcon} />
        {loading && (
          <View style={styles.loadingView}>
            <Loading color={theme.colors.button.primary} />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

TabHeader.propTypes = {};

export default React.memo(TabHeader);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#000',
  },
  avatarView: {
    paddingHorizontal: theme.contentPadding,
    paddingBottom: 13,
  },
  avatar: {
    width: 40,
    height: 40,
  },
  distanceWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  distanceView: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 25,
    backgroundColor: '#F4AC37',
  },
  spendWalletView: {
    borderRadius: 30,
    height: 30,
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: theme.contentPadding,
    backgroundColor: '#0E1718',
  },
  tokenView: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 7,
  },
  tokenImg: {
    width: 15,
    height: 15,
  },
  bepView: {
    width: 30,
    height: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBAD0E',
  },
  bepIcon: {
    width: 28,
    height: 28,
  },
  loadingView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
});
