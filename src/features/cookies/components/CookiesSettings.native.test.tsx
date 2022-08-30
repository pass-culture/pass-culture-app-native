import React from 'react'

import { CookiesSettings } from 'features/cookies/components/CookiesSettings'
import { render } from 'tests/utils'

describe('<CookiesSettings/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<CookiesSettings />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should disable and checked essential cookies switch', () => {
    const { getByTestId } = render(<CookiesSettings />)

    const essentialToggle = getByTestId('Interrupteur-essential')

    expect(essentialToggle.props.accessibilityState).toEqual({
      disabled: true,
      checked: true,
    })
  })
})
