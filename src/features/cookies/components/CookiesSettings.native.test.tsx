import React from 'react'

import { cookiesInfo } from 'features/cookies/components/cookiesInfo'
import { CookiesSettings } from 'features/cookies/components/CookiesSettings'
import { CookieCategoriesEnum } from 'features/cookies/enums'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

jest.mock('features/profile/api/useUpdateProfileMutation')

describe('<CookiesSettings/>', () => {
  it('should render correctly', async () => {
    const renderAPI = renderCookiesSettings()

    await screen.findAllByRole('checkbox')

    expect(renderAPI).toMatchSnapshot()
  })

  it('should disable and check essential cookies switch', async () => {
    renderCookiesSettings()

    await screen.findAllByRole('checkbox')

    const essentialToggle = screen.getByTestId('Interrupteur-essential')

    expect(essentialToggle.props.accessibilityState).toEqual({
      disabled: true,
      checked: true,
    })
  })

  it('should log accordion toggle', async () => {
    renderCookiesSettings()

    const cookieCategory = CookieCategoriesEnum.customization
    const customizationAccordion = screen.getByText(cookiesInfo[cookieCategory].title)
    fireEvent.press(customizationAccordion)

    await waitFor(() =>
      expect(analytics.logHasOpenedCookiesAccordion).toBeCalledWith(cookieCategory)
    )
  })
})

const renderCookiesSettings = () =>
  render(
    <CookiesSettings
      settingsCookiesChoice={{
        marketing: false,
        performance: false,
        customization: false,
      }}
      setSettingsCookiesChoice={() => null}
    />
  )
