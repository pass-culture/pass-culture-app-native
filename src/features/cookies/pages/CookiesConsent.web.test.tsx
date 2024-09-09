import React from 'react'

import { CookiesConsent } from 'features/cookies/pages/CookiesConsent'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render } from 'tests/utils/web'

jest.mock('features/navigation/navigationRef')

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<CookiesConsent/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = await renderCookiesConsent()
      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})

const renderCookiesConsent = async () => {
  const renderAPI = render(<CookiesConsent visible hideModal={jest.fn()} />, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
  return renderAPI
}
