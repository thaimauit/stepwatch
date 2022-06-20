import { get } from 'lodash';

const DEBUG_MODE = __DEV__;
function info(message, data, ...rest) {
  if (!DEBUG_MODE) return;

  const fileName = get(arguments, 'callee.caller.name');
  window.console.log(message, data, rest, { at: fileName });
}

export default {
  info,
};
