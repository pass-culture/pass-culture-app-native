import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { SignupConfirmationEmailSentPage } from './SignupConfirmationEmailSentPage'

const navigationProps = {
  route: { params: { email: 'john.doe@gmail.com' } },
} as StackScreenProps<RootStackParamList, 'SignupConfirmationEmailSent'>

describe('<SignupConfirmationEmailSentPage/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<SignupConfirmationEmailSentPage {...navigationProps} />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
