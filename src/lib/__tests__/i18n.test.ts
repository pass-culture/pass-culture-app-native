import { findBestAvailableLanguage } from 'react-native-localize';
import { i18n } from '../i18n';
import { t } from '@lingui/macro';

describe('i18n', () => {
  describe('t', () => {
    it('translates to english', () => {
      expect(findBestAvailableLanguage).toHaveBeenCalled();
      expect(i18n._(t`Welcome to BAM!`)).toEqual('Welcome to BAM!');
    });
    it('translates to french when language is set to french', () => {
      i18n.activate('fr');
      expect(findBestAvailableLanguage).toHaveBeenCalled();
      expect(i18n._(t`Welcome to BAM!`)).toEqual('Bienvenue chez BAM');
    });
  });
});
