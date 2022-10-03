import React from 'react'

import { cookiesInfo } from 'features/cookies/components/cookiesInfo'
import { CookiesSettings } from 'features/cookies/components/CookiesSettings'
import { CookieCategoriesEnum } from 'features/cookies/enums'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render, waitFor } from 'tests/utils'

const mockSettings = jest.fn().mockReturnValue({ data: { appEnableCookiesV2: true } })
jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(() => mockSettings()),
}))

jest.mock('features/profile/api')

describe('<CookiesSettings/>', () => {
  it('should render correctly', () => {
    const renderAPI = renderCookiesSettings()
    expect(renderAPI).toMatchSnapshot()
  })

  it('should disable and check essential cookies switch', () => {
    const { getByTestId } = renderCookiesSettings()

    const essentialToggle = getByTestId('Interrupteur-essential')

    expect(essentialToggle.props.accessibilityState).toEqual({
      disabled: true,
      checked: true,
    })
  })

  it('should log accordion toggle', async () => {
    const { getByText } = renderCookiesSettings()

    const cookieCategory = CookieCategoriesEnum.customization
    const customizationAccordion = getByText(cookiesInfo[cookieCategory].title)
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
