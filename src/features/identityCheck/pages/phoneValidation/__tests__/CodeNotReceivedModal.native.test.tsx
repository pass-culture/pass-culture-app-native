import React from 'react'

import { CodeNotReceivedModal } from 'features/identityCheck/pages/phoneValidation/CodeNotReceivedModal'
import { fireEvent, render } from 'tests/utils'

describe('<CodeNotReceivedModal />', () => {
  it('should match snapshot', () => {
    const renderAPI = render(<CodeNotReceivedModal isVisible dismissModal={jest.fn()} />)
    expect(renderAPI).toMatchSnapshot()
  })

  // TODO PC-14462: if requestsRemaining is passed as props, test case where requestsRemaining is 1 for style

  it('should call dismissModal upon pressing on Close', () => {
    const dismissModalMock = jest.fn()
    const { getByTestId } = render(
      <CodeNotReceivedModal isVisible dismissModal={dismissModalMock} />
    )
    const closeButton = getByTestId('Fermer la modale')

    fireEvent.press(closeButton)
    expect(dismissModalMock).toBeCalled()
  })

  it('should call dismissModal upon pressing on "Demander un autre code"', () => {
    const dismissModalMock = jest.fn()
    const { getByText } = render(<CodeNotReceivedModal isVisible dismissModal={dismissModalMock} />)
    const closeButton = getByText('Demander un autre code')

    fireEvent.press(closeButton)
    expect(dismissModalMock).toBeCalled()
  })
})
