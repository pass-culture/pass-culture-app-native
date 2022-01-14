import { t } from '@lingui/macro'
import { act } from 'react-test-renderer'

import { activate } from './i18n'

describe('i18n', () => {
  describe('t', () => {
    it('translates to french by default', () => {
      act(async () => {
        await activate('fr')
      })
      expect(t`Welcome to pass Culture`).toEqual('Bienvenue à pass Culture')
    })
  })
})
