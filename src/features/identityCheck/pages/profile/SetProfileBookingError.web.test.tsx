import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { SetProfileBookingError } from 'features/identityCheck/pages/profile/SetProfileBookingError'
import { SubscriptionRootStackParamList } from 'features/navigation/RootNavigator/types'
import { checkAccessibilityFor, render } from 'tests/utils/web'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('<SetProfileBookingError/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = renderSetProfileBookingError({ offerId: 123 })

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

const renderSetProfileBookingError = (navigationParams: { offerId?: number }) => {
  const navProps = { route: { params: navigationParams } } as StackScreenProps<
    SubscriptionRootStackParamList,
    'SetProfileBookingError'
  >
  return render(<SetProfileBookingError {...navProps} />)
}
