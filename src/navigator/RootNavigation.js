import { navigationRef } from './AppNavigator';

const navigate = (...params) => {
  if (navigationRef.current) navigationRef.current.navigate(...params);
};

const openDrawer = () => {
  if (navigationRef.current) navigationRef.current.openDrawer();
};

export default {
  navigate,
  openDrawer,
};
