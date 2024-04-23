import React from 'react'

import { IncentiveLocationModal } from 'features/search/components/IncentiveLocationModal/IncentiveLocationModal'
import { fireEvent, render, screen } from 'tests/utils'

const hideModalMock = jest.fn()

describe('<IncentiveLocationModal />', () => {
  it('should call hideModal function when pressing close icon', () => {
    render(<IncentiveLocationModal visible handleCloseModal={hideModalMock} />)
    const rightIcon = screen.getByTestId('Fermer la modale')
    fireEvent.press(rightIcon)

    expect(hideModalMock).toHaveBeenCalledTimes(1)
  })
})
