import React from 'react'

import { SetCity } from 'features/identityCheck/pages/profile/SetCity'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render, screen, waitFor } from 'tests/utils/web'

jest.mock('uuid', () => ({
  v1: jest.fn(),
  v4: jest.fn(),
}))

jest.mock('features/identityCheck/context/SubscriptionContextProvider')
jest.mock('ui/theme/customFocusOutline/customFocusOutline')

describe('<SetCity/>', () => {
  it('should render correctly', () => {
    const { container } = render(reactQueryProviderHOC(<SetCity />))

    expect(container).toMatchSnapshot()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<SetCity />))

      await waitFor(() => {
        expect(screen.getByTestId('Entrée pour la ville')).toHaveFocus()
      })

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
