const { useSafeAreaInsets } = require('react-native-safe-area-context');

const useInsets = () => {
  const { top: safeTop, bottom: safeBottom } = useSafeAreaInsets();

  const top = safeTop > 25 ? safeTop - 10 : 10;

  const bottom = safeBottom > 15 ? safeBottom : 10;

  return {
    top,
    bottom,
  };
};

export default useInsets;
