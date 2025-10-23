import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'

import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render } from 'tests/utils/web'

import { SignupConfirmationExpiredLink } from './SignupConfirmationExpiredLink'

const navigationProps = {
  route: { params: { email: 'john.doe@gmail.com' } },
} as NativeStackScreenProps<RootStackParamList, 'SignupConfirmationExpiredLink'>

jest.mock('libs/firebase/analytics/analytics')

describe('<SignupConfirmationExpiredLink/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        reactQueryProviderHOC(<SignupConfirmationExpiredLink {...navigationProps} />)
      )

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
