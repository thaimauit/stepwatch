import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ImageAssets } from 'src/assets';
import Loading from './Loading';

const Image = props => {
  const { source, defaultSource, ...rest } = props;
  const [loading, setLoading] = useState(false);

  const imgDefaultSource = useMemo(() => {
    if (defaultSource) return defaultSource;
    return ImageAssets.placeholder;
  }, [defaultSource]);
  const imgSource = useMemo(() => {
    if (typeof source === 'object' && !source.uri) return imgDefaultSource;
    return source;
  }, [source, imgDefaultSource]);

  const onLoadStart = useCallback(() => setLoading(true), []);
  const onLoadEnd = useCallback(() => setLoading(false), []);

  return (
    <FastImage
      onLoadStart={onLoadStart}
      onLoadEnd={onLoadEnd}
      defaultSource={imgDefaultSource}
      source={imgSource}
      {...rest}>
      {loading && <Loading style={styles.loadingView} />}
    </FastImage>
  );
};
export default React.memo(Image);

Image.propTypes = {};

const styles = StyleSheet.create({
  container: {},
  loadingView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
