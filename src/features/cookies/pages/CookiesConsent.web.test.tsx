import React from 'react'

import { CookiesConsent } from 'features/cookies/pages/CookiesConsent'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render } from 'tests/utils/web'

jest.mock('features/navigation/navigationRef')

jest.mock('libs/firebase/analytics/analytics')

describe('<CookiesConsent/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = renderCookiesConsent()
      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})

const renderCookiesConsent = () => {
  return render(<CookiesConsent visible hideModal={jest.fn()} />, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
