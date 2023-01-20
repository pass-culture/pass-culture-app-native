import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { SignupConfirmationExpiredLink } from './SignupConfirmationExpiredLink'

jest.mock('react-query')

const navigationProps = {
  route: { params: { email: 'john.doe@gmail.com' } },
} as StackScreenProps<RootStackParamList, 'SignupConfirmationExpiredLink'>

describe('<SignupConfirmationExpiredLink/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<SignupConfirmationExpiredLink {...navigationProps} />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
