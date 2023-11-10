import React from 'react'

import { CookiesConsent } from 'features/cookies/pages/CookiesConsent'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, flushAllPromisesWithAct, checkAccessibilityFor } from 'tests/utils/web'

jest.mock('features/navigation/navigationRef')

describe('<CookiesConsent/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = await renderCookiesConsent()

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

const renderCookiesConsent = async () => {
  const renderAPI = render(<CookiesConsent visible hideModal={jest.fn()} />, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
  await flushAllPromisesWithAct()
  return renderAPI
}
