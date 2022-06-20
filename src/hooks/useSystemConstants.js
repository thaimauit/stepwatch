const { useEffect, useCallback } = require('react');
const { useSelector, useDispatch } = require('react-redux');
const { selectors, actions } = require('src/models');

const useSystemConstants = () => {
  const dispatch = useDispatch();
  const sysConstants = useSelector(selectors.common.constants);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchData = useCallback(() => {
    dispatch(actions.common.getConstants());
  }, [dispatch]);

  return {
    sysConstants,
  };
};

export default useSystemConstants;
