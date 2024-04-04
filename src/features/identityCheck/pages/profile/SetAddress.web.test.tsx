import React from 'react'

import { SetAddress } from 'features/identityCheck/pages/profile/SetAddress'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { waitFor, screen, checkAccessibilityFor, render } from 'tests/utils/web'

const mockV4 = jest.fn()
jest.mock('uuid', () => ({
  v1: jest.fn(),
  v4: jest.fn(mockV4),
}))

jest.mock('features/identityCheck/context/SubscriptionContextProvider')

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
