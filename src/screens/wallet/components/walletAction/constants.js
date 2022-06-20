import { ICON_TYPES } from 'src/components';
import constants from 'src/constants';

export const ACTION_KEYS = {
  RECEIVE: 'receive',
  TRANSFER: 'transfer',
  TRANSFER_IN: 'transfer-inAPP',
  TRANSFER_OUT: 'transfer-out',
  TRADE: 'Trade',
};

export const ACTIONS = [
  {
    icon: {
      name: 'download-outline',
      type: ICON_TYPES.ION_ICON,
    },
    name: 'Receive',
    key: ACTION_KEYS.RECEIVE,
  },
  {
    icon: {
      name: 'arrow-top-right',
      type: ICON_TYPES.MATERIAL_COMMUNITY,
    },
    name: 'Transfer',
    key: ACTION_KEYS.TRANSFER,
    childs: [
      {
        icon: {
          name: 'swap',
          type: ICON_TYPES.ANT_DESIGN_ICON,
        },
        name: 'To\nFunding',
        key: ACTION_KEYS.TRANSFER_IN,
      },
      {
        icon: {
          name: 'arrow-top-right',
          type: ICON_TYPES.MATERIAL_COMMUNITY,
        },
        name: 'To\nExternal',
        key: ACTION_KEYS.TRANSFER_OUT,
      },
    ],
  },
  {
    icon: {
      name: 'swap',
      type: ICON_TYPES.ANT_DESIGN_ICON,
    },
    name: 'Trade',
    key: ACTION_KEYS.TRADE,
    screen: constants.screens.TRADE,
  },
];
