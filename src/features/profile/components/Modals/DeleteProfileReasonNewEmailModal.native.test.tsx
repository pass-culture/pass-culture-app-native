import React from 'react'

import { DeleteProfileReasonNewEmailModal } from 'features/profile/components/Modals/DeleteProfileReasonNewEmailModal'
import { fireEvent, render, screen } from 'tests/utils'

const hideModalMock = jest.fn()

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<DeleteProfileReasonNewEmailModal/>', () => {
  it('should call hideModal function when clicking on Close icon', () => {
    render(<DeleteProfileReasonNewEmailModal isVisible hideModal={hideModalMock} />)

    const rightIcon = screen.getByTestId('Fermer la modale')
    fireEvent.press(rightIcon)

    expect(hideModalMock).toHaveBeenCalledTimes(1)
  })
})
