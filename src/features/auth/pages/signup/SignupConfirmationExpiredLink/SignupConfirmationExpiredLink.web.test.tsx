import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render } from 'tests/utils/web'

import { SignupConfirmationExpiredLink } from './SignupConfirmationExpiredLink'

const navigationProps = {
  route: { params: { email: 'john.doe@gmail.com' } },
} as StackScreenProps<RootStackParamList, 'SignupConfirmationExpiredLink'>

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

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
