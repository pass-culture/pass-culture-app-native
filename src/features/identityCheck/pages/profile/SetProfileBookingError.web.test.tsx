import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { SetProfileBookingError } from 'features/identityCheck/pages/profile/SetProfileBookingError'
import { checkAccessibilityFor, render } from 'tests/utils/web'

jest.mock('libs/firebase/analytics/analytics')

useRoute.mockReturnValue({
  params: { offerId: 123 },
})

describe('<SetProfileBookingError/>', () => {
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
