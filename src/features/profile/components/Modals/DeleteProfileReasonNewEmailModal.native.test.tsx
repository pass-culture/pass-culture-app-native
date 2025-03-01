import React from 'react'

import { DeleteProfileReasonNewEmailModal } from 'features/profile/components/Modals/DeleteProfileReasonNewEmailModal'
import { fireEvent, render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const hideModalMock = jest.fn()

describe('<DeleteProfileReasonNewEmailModal/>', () => {
  it('should call hideModal function when clicking on Close icon', () => {
    render(<DeleteProfileReasonNewEmailModal isVisible hideModal={hideModalMock} />)

    const rightIcon = screen.getByTestId('Fermer la modale')
    fireEvent.press(rightIcon)

    expect(hideModalMock).toHaveBeenCalledTimes(1)
  })
})
