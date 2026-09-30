import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { SetProfileBookingError } from 'features/identityCheck/pages/profile/SetProfileBookingError'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { checkAccessibilityFor, render } from 'tests/utils/web'

jest.mock('libs/firebase/analytics/analytics')

useRoute.mockReturnValue({
  params: { offerId: 123 },
})

describe('<SetProfileBookingError/>', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = renderSetProfileBookingError()

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

const renderSetProfileBookingError = () => {
  return render(<SetProfileBookingError />)
}
