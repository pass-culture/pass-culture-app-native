import React from 'react'

import { analytics } from 'libs/analytics/provider'
import { render, screen, userEvent } from 'tests/utils'

import { DeleteProfileContactSupport } from './DeleteProfileContactSupport'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('DeleteProfileContactSupport', () => {
  it('should render correctly', () => {
    render(<DeleteProfileContactSupport />)

    expect(screen).toMatchSnapshot()
  })

  it('should log HasClickedContactForm event when press "Contacter le support" button', async () => {
    render(<DeleteProfileContactSupport />)

    const contactSupportButton = screen.getByText('Contacter le support')

    await userEvent.press(contactSupportButton)

    expect(analytics.logHasClickedContactForm).toHaveBeenNthCalledWith(
      1,
      'DeleteProfileContactSupport'
    )
  })
})
