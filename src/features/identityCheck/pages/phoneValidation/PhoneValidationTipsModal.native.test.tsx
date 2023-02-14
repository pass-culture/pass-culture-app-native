import React from 'react'

import { PhoneValidationTipsModal } from 'features/identityCheck/pages/phoneValidation/PhoneValidationTipsModal'
import { fireEvent, render } from 'tests/utils'

describe('<PhoneValidationTipsModal />', () => {
  it('should match snapshot', () => {
    const renderAPI = render(
      <PhoneValidationTipsModal isVisible dismissModal={jest.fn()} onGoBack={jest.fn()} />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  it("should call dismissModal upon pressing 'j'ai compris'", () => {
    const dismissModalMock = jest.fn()
    const { getByText } = render(
      <PhoneValidationTipsModal isVisible dismissModal={dismissModalMock} onGoBack={jest.fn()} />
    )
    const gotItButton = getByText('J’ai compris')

    fireEvent.press(gotItButton)
    expect(dismissModalMock).toHaveBeenCalledTimes(1)
  })
})
