import { useCallback, useState } from 'react';

const useVisible = (initVisible = false) => {
  const [visible, setVisible] = useState(initVisible);

  const show = useCallback(() => {
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    setVisible(false);
  }, []);

  return {
    visible,
    show,
    hide,
  };
};

export default useVisible;
