import React from 'react'

import { mockSettings } from 'features/auth/context/mockSettings'
import { SetAddress } from 'features/identityCheck/pages/profile/SetAddress'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render, screen, waitFor } from 'tests/utils/web'

jest.mock('uuid', () => ({
  v1: jest.fn(),
  v4: jest.fn(),
}))

mockSettings()

jest.mock('features/identityCheck/context/SubscriptionContextProvider')
jest.mock('ui/theme/customFocusOutline/customFocusOutline')
mockSettings()

describe('<SetAddress/>', () => {
  it('should render correctly', () => {
    const { container } = render(reactQueryProviderHOC(<SetAddress />))

    expect(container).toMatchSnapshot()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<SetAddress />))

      await waitFor(() => {
        expect(screen.getByTestId('Entrée pour l’adresse')).toHaveFocus()
      })

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
