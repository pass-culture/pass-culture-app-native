import { t } from '@lingui/macro'
import { findBestAvailableLanguage } from 'react-native-localize'

import { i18n } from './i18n'

describe('i18n', () => {
  describe('t', () => {
    it('translates to french by default', () => {
      expect(findBestAvailableLanguage).toHaveBeenCalled()
      expect(i18n._(t`Welcome to BAM!`)).toEqual('Bienvenue chez BAM')
    })
  })
})
