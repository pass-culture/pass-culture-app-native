import React from 'react'

import { DeleteProfileReasonNewEmailModal } from 'features/profile/components/Modals/DeleteProfileReasonNewEmailModal'
import { render, screen, userEvent } from 'tests/utils'

const hideModalMock = jest.fn()

const user = userEvent.setup()
jest.useFakeTimers()

describe('<DeleteProfileReasonNewEmailModal/>', () => {
  it('should call hideModal function when clicking on Close icon', async () => {
    render(<DeleteProfileReasonNewEmailModal isVisible hideModal={hideModalMock} />)

    const rightIcon = screen.getByTestId('Fermer la modale')
    await user.press(rightIcon)

    expect(hideModalMock).toHaveBeenCalledTimes(1)
  })
})
