import React from 'react'

import { IncentiveLocationModal } from 'features/search/components/IncentiveLocationModal/IncentiveLocationModal'
import { fireEvent, render, screen } from 'tests/utils'

const hideModalMock = jest.fn()
const handleActiveLocationButtonPressMock = jest.fn()

describe('<IncentiveLocationModal />', () => {
  it('should hide the modal when pressing close icon', () => {
    render(
      <IncentiveLocationModal
        visible
        handleCloseModal={hideModalMock}
        handleActiveLocationButtonPress={handleActiveLocationButtonPressMock}
      />
    )
    const rightIcon = screen.getByTestId('Fermer la modale')
    fireEvent.press(rightIcon)

    expect(hideModalMock).toHaveBeenCalledTimes(1)
  })

  it('should open location modal when pressing "Activer ma localisation" button', () => {
    render(
      <IncentiveLocationModal
        visible
        handleCloseModal={hideModalMock}
        handleActiveLocationButtonPress={handleActiveLocationButtonPressMock}
      />
    )

    fireEvent.press(screen.getByText('Activer ma localisation'))

    expect(handleActiveLocationButtonPressMock).toHaveBeenCalledTimes(1)
  })
})
