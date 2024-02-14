import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { ResetPasswordExpiredLink } from './ResetPasswordExpiredLink'

const navigationProps = {
  route: { params: { email: 'test@email.com' } },
} as StackScreenProps<RootStackParamList, 'ResetPasswordExpiredLink'>

describe('<ResetPasswordExpiredLink/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        reactQueryProviderHOC(<ResetPasswordExpiredLink {...navigationProps} />)
      )

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
