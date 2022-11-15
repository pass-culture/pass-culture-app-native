import React from 'react'

import { CookiesConsent } from 'features/cookies/pages/CookiesConsent'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, flushAllPromisesWithAct, checkAccessibilityFor } from 'tests/utils/web'

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
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
  await flushAllPromisesWithAct()
  return renderAPI
}
