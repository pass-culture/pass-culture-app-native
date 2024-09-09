import React from 'react'

import { render, checkAccessibilityFor, screen } from 'tests/utils/web'

import { BeneficiaryAccountCreated } from './BeneficiaryAccountCreated'

jest.mock('features/auth/context/AuthContext')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<BeneficiaryAccountCreated/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<BeneficiaryAccountCreated />)

      await screen.findByLabelText('C’est parti !')

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
