import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from 'src/models';
import services from 'src/services';
import { Utils } from 'src/utils';

const useInitProfile = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectors.profile.token);
  const timer = useRef();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) startInit(token);
  }, [token, startInit]);

  const startInit = useCallback(
    async initToken => {
      setLoading(true);
      timer.current = null;
      clearTimeout(timer.current);
      services.setToken(initToken);
      await Utils.delay(100);
      dispatch(actions.wallet.getFundingWallet());
      dispatch(
        actions.profile.getProfile(userData => {
          const success = !!userData;
          if (success) {
            setLoading(false);
            return;
          }
          timer.current = setTimeout(() => {
            startInit();
          }, 2000);
        }),
      );
    },
    [dispatch],
  );

  const stopLoading = useCallback(() => {
    setLoading(false);
    clearTimeout(timer.current);
  }, []);

  return {
    loading,
    stopLoading,
  };
};

export default useInitProfile;
