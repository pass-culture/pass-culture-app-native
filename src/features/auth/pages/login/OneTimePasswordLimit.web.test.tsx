import React from 'react'

import * as useOneTimePasswordAttemptsModule from 'features/auth/helpers/useOneTimePasswordAttempts'
import * as formatRemainingTimeModule from 'shared/times/formatRemainingTime'
import { checkAccessibilityFor, render, screen } from 'tests/utils/web'

import { OneTimePasswordLimit } from './OneTimePasswordLimit'

jest.spyOn(useOneTimePasswordAttemptsModule, 'useOneTimePasswordAttempts').mockReturnValue({
  remainingSeconds: 3600,
  failedAttempts: 0,
  codeError: undefined,
  hasReachedMaxCodeAttempts: false,
  loginEmail: null,
  saveLoginEmail: jest.fn(),
  registerFailedAttempt: jest.fn(),
  clearCodeError: jest.fn(),
  isLastAttempt: false,
  maxCodeAttempts: 0,
})

jest.spyOn(formatRemainingTimeModule, 'formatRemainingTime').mockReturnValue('1 heure')

describe('<OneTimePasswordLimit />', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<OneTimePasswordLimit />)

      await screen.findByText('Limite d’essais atteinte')

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
