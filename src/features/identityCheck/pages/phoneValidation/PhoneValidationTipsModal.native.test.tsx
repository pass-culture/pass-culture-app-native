import React from 'react'

import { PhoneValidationTipsModal } from 'features/identityCheck/pages/phoneValidation/PhoneValidationTipsModal'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})
const user = userEvent.setup()
jest.useFakeTimers()

describe('<PhoneValidationTipsModal />', () => {
  it('should match snapshot', () => {
    render(<PhoneValidationTipsModal isVisible dismissModal={jest.fn()} onGoBack={jest.fn()} />)

    expect(screen).toMatchSnapshot()
  })

  it("should call dismissModal upon pressing 'j'ai compris'", async () => {
    const dismissModalMock = jest.fn()

    render(
      <PhoneValidationTipsModal isVisible dismissModal={dismissModalMock} onGoBack={jest.fn()} />
    )

    const gotItButton = screen.getByText('J’ai compris')
    await user.press(gotItButton)

    expect(dismissModalMock).toHaveBeenCalledTimes(1)
  })
})
