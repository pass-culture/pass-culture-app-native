import React from 'react'

import { cookiesInfo } from 'features/cookies/components/cookiesInfo'
import { CookiesSettings } from 'features/cookies/components/CookiesSettings'
import { CookieCategoriesEnum } from 'features/cookies/enums'
import { analytics } from 'libs/analytics/provider'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent, waitFor } from 'tests/utils'

jest.mock('queries/profile/usePatchProfileMutation')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

jest.useFakeTimers()

describe('<CookiesSettings/>', () => {
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
})

const renderCookiesSettings = () =>
  render(
    reactQueryProviderHOC(
      <CookiesSettings
        settingsCookiesChoice={{
          marketing: false,
          performance: false,
          customization: false,
        }}
        setSettingsCookiesChoice={jest.fn()}
      />
    )
  )
