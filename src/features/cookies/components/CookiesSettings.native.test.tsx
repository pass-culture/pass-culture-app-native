import React from 'react'

import { CookiesSettings } from 'features/cookies/components/CookiesSettings'
import { render } from 'tests/utils'

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
