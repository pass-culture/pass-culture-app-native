import React from 'react'

import { CodeNotReceivedModal } from 'features/identityCheck/pages/phoneValidation/CodeNotReceivedModal'
import { fireEvent, render } from 'tests/utils'

describe('<CodeNotReceivedModal />', () => {
  it('should match snapshot', () => {
    const renderAPI = render(<CodeNotReceivedModal isVisible dismissModal={jest.fn()} />)
    expect(renderAPI).toMatchSnapshot()
  })

  it("should call dismissModal upon pressing 'j'ai compris'", () => {
    const dismissModalMock = jest.fn()
    const { getByTestId } = render(
      <CodeNotReceivedModal isVisible dismissModal={dismissModalMock} />
    )
    const closeButton = getByTestId('Fermer la modale')

    fireEvent.press(closeButton)
    expect(dismissModalMock).toBeCalled()
  })
})
