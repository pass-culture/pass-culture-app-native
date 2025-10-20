import React from 'react'

import { cookiesInfo } from 'features/cookies/components/cookiesInfo'
import { CookiesSettings } from 'features/cookies/components/CookiesSettings'
import { CookieCategoriesEnum } from 'features/cookies/enums'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent, waitFor } from 'tests/utils'

jest.mock('queries/profile/usePatchProfileMutation')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

jest.mock('ui/components/anchor/AnchorContext', () => ({
  useScrollToAnchor: jest.fn,
  useRegisterAnchor: jest.fn,
}))

jest.useFakeTimers()

describe('<CookiesSettings/>', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should disable and check essential cookies switch', async () => {
    renderCookiesSettings()

    const essentialToggle = await screen.findByTestId(
      /Assurer la sécurité, prévenir la fraude et corriger les bugs - Interrupteur à bascule/
    )

    expect(essentialToggle).toBeDisabled()
    expect(essentialToggle).toHaveAccessibilityState({ checked: true })
  })

  it('should log accordion toggle', async () => {
    renderCookiesSettings()

    const cookieCategory = CookieCategoriesEnum.customization
    const customizationAccordion = screen.getByText(cookiesInfo[cookieCategory].title)
    await userEvent.setup().press(customizationAccordion)

    await waitFor(() =>
      expect(analytics.logHasOpenedCookiesAccordion).toHaveBeenCalledWith(cookieCategory)
    )
  })

  it('should not display video cookies toggle when wipVideoCookiesConsent FF deactivated', async () => {
    renderCookiesSettings()

    await screen.findByTestId(
      /Assurer la sécurité, prévenir la fraude et corriger les bugs - Interrupteur à bascule/
    )

    const videoCookieCategory = CookieCategoriesEnum.video

    expect(screen.queryByText(cookiesInfo[videoCookieCategory].title)).not.toBeOnTheScreen()
  })

  it('should display video cookies toggle when wipVideoCookiesConsent FF activated', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_VIDEO_COOKIES_CONSENT])
    renderCookiesSettings()

    const videoCookieCategory = CookieCategoriesEnum.video

    expect(await screen.findByText(cookiesInfo[videoCookieCategory].title)).toBeOnTheScreen()
  })
})

const renderCookiesSettings = () =>
  render(
    reactQueryProviderHOC(
      <CookiesSettings
        settingsCookiesChoice={{
          marketing: false,
          performance: false,
          customization: false,
          video: false,
        }}
        setSettingsCookiesChoice={jest.fn()}
      />
    )
  )
