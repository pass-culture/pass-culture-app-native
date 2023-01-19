import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { ResetPasswordExpiredLink } from './ResetPasswordExpiredLink'

jest.mock('react-query')

const navigationProps = { route: { params: { email: 'test@email.com' } } }

describe('<ResetPasswordExpiredLink/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <ResetPasswordExpiredLink
          {...(navigationProps as StackScreenProps<RootStackParamList, 'ResetPasswordExpiredLink'>)}
        />
      )

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
