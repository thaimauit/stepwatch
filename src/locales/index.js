import { isEmpty } from 'lodash';
import I18n, { getLanguages } from 'react-native-i18n';
import { common } from './models';
import en from './en';
import kr from './kr';
import vi from './vi';
import { store } from 'src/redux';
import { actions } from 'src/models';

const LANGUAGES = {
  ENGLISH: 'en',
  KOREAN: 'kr',
  VIETNAM: 'vi',
};

const LANGUAGE_SUPPORTS = [
  {
    key: LANGUAGES.ENGLISH,
    name: 'common.locales.en',
  },
  {
    key: LANGUAGES.VIETNAM,
    name: 'common.locales.vi',
  },
  // {
  //   key: LANGUAGES.KOREAN,
  //   name: 'common.locales.kr',
  // },
];

const changeLanguage = language => {
  I18n.locale = language;
  store.dispatch(actions.userSettings.saveData({ language }));
};

const Scopes = {
  common,
};

const defaultLocale = LANGUAGES.ENGLISH;

const initLocale = async () => {
  I18n.fallbacks = true;

  I18n.translations = {
    en,
    kr,
    vi,
  };
  I18n.defaultLocale = defaultLocale;
  I18n.locale = defaultLocale;

  const storageLocale = store.getState().userSettings.language;
  if (storageLocale) return (I18n.locale = storageLocale);

  const userLanguage = await getLanguages();
  if (isEmpty(userLanguage)) return;
  const locale = userLanguage.find(currentLocale => {
    if (currentLocale.includes('-')) {
      const firtInLocale = currentLocale.split('-')[0];
      if (Object.values(LANGUAGES).includes(firtInLocale)) return true;
    }
    if (Object.values(LANGUAGES).includes(currentLocale)) return true;
    return false;
  });

  if (!locale) return;

  if (locale.includes('-')) {
    const firtInLocale = locale.split('-')[0];
    if (Object.values(LANGUAGES).includes(firtInLocale))
      return (I18n.locale = firtInLocale);
  }
  if (Object.values(LANGUAGES).includes(locale)) I18n.locale = locale;
};

const locale = (scope, params = {}) => I18n.t(scope, params);

const currentLocale = () => I18n.currentLocale();

const Locales = {
  initLocale,
  changeLanguage,
  locale,
  currentLocale,
  LANGUAGE_SUPPORTS,
  LANGUAGES,
  Scopes,
};
export default Locales;
