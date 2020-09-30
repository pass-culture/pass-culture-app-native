import { setupI18n } from '@lingui/core'; //@translations
import { findBestAvailableLanguage } from 'react-native-localize';
import englishCatalog from '../locales/en/messages';
import frenchCatalog from '../locales/fr/messages';

const fallbackLanguageTag = 'en';

const { languageTag } = findBestAvailableLanguage([fallbackLanguageTag, 'fr']) as {
  languageTag: string;
  isRTL: boolean;
};

export const i18n = setupI18n({
  language: languageTag || fallbackLanguageTag,
  catalogs: {
    en: englishCatalog,
    fr: frenchCatalog,
  },
});
