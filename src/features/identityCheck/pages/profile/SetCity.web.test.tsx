import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { SetCity } from 'features/identityCheck/pages/profile/SetCity'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render, screen, waitFor } from 'tests/utils/web'

jest.mock('uuid', () => ({
  v1: jest.fn(),
  v4: jest.fn(),
}))

jest.mock('features/identityCheck/context/SubscriptionContextProvider')
jest.mock('ui/theme/customFocusOutline/customFocusOutline')

useRoute.mockReturnValue({
  params: { type: ProfileTypes.IDENTITY_CHECK },
})

describe('<SetCity/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = renderSetCity()

      await waitFor(() => {
        expect(screen.getByTestId('Entrée pour la ville')).toHaveFocus()
      })

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

const renderSetCity = () => {
  return render(reactQueryProviderHOC(<SetCity />))
}
