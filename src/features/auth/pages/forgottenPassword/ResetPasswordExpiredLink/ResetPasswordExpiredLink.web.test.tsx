import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'

import { RootStackParamList } from 'features/navigation/navigators/RootNavigator/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render } from 'tests/utils/web'

import { ResetPasswordExpiredLink } from './ResetPasswordExpiredLink'

const navigationProps = {
  route: { params: { email: 'test@email.com' } },
} as NativeStackScreenProps<RootStackParamList, 'ResetPasswordExpiredLink'>

jest.mock('libs/firebase/analytics/analytics')

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
