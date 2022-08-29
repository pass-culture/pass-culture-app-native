import React from 'react'

import { CookiesSettings } from 'features/cookies/components/CookiesSettings'
import { render, fireEvent, waitFor } from 'tests/utils'

describe('<CookiesSettings/>', () => {
  it('should render correctly', async () => {
    const renderAPI = render(<CookiesSettings />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should disable and keep checked essential cookies switch', async () => {
    const { getAllByTestId } = render(<CookiesSettings />)

    const essentialToggle = getAllByTestId('Interrupteur').pop()
    expect(essentialToggle?.props.accessibilityState).toEqual({
      disabled: true,
      checked: true,
    })

    essentialToggle && fireEvent.press(essentialToggle)

    await waitFor(() => {
      expect(essentialToggle?.props.accessibilityState).toEqual({
        disabled: true,
        checked: true,
      })
    })
  })
})
