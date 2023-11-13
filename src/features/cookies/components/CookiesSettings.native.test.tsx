import React from 'react'

import { cookiesInfo } from 'features/cookies/components/cookiesInfo'
import { CookiesSettings } from 'features/cookies/components/CookiesSettings'
import { CookieCategoriesEnum } from 'features/cookies/enums'
import { analytics } from 'libs/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

jest.mock('features/profile/api/useUpdateProfileMutation')

describe('<CookiesSettings/>', () => {
  it('should render correctly', async () => {
    renderCookiesSettings()

    await screen.findByTestId(
      'Interrupteur Assurer la sécurité, prévenir la fraude et corriger les bugs'
    )

    expect(screen).toMatchSnapshot()
  })

  it('should disable and check essential cookies switch', async () => {
    renderCookiesSettings()

    const essentialToggle = await screen.findByTestId(
      'Interrupteur Assurer la sécurité, prévenir la fraude et corriger les bugs'
    )

    expect(essentialToggle).toBeDisabled()
    expect(essentialToggle).toHaveAccessibilityState({ checked: true })
  })

  it('should log accordion toggle', async () => {
    renderCookiesSettings()

    const cookieCategory = CookieCategoriesEnum.customization
    const customizationAccordion = screen.getByText(cookiesInfo[cookieCategory].title)
    fireEvent.press(customizationAccordion)

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
