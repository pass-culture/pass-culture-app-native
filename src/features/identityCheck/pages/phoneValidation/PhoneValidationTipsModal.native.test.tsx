import React from 'react'

import { PhoneValidationTipsModal } from 'features/identityCheck/pages/phoneValidation/PhoneValidationTipsModal'
import { fireEvent, render, screen } from 'tests/utils'

describe('<PhoneValidationTipsModal />', () => {
  it('should match snapshot', () => {
    render(<PhoneValidationTipsModal isVisible dismissModal={jest.fn()} onGoBack={jest.fn()} />)

    expect(screen).toMatchSnapshot()
  })

  it("should call dismissModal upon pressing 'j'ai compris'", () => {
    const dismissModalMock = jest.fn()

    render(
      <PhoneValidationTipsModal isVisible dismissModal={dismissModalMock} onGoBack={jest.fn()} />
    )

    const gotItButton = screen.getByText('J’ai compris')

    fireEvent.press(gotItButton)

    expect(dismissModalMock).toHaveBeenCalledTimes(1)
  })
})
