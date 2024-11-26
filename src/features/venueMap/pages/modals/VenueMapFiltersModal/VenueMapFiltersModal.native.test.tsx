import React from 'react'
import { View } from 'react-native'

import { VenueMapFiltersModal } from 'features/venueMap/pages/modals/VenueMapFiltersModal/VenueMapFiltersModal'
import { render, screen, userEvent } from 'tests/utils'

const mockHandleOnClose = jest.fn()
const mockHandleGoBack = jest.fn()

const user = userEvent.setup()

jest.useFakeTimers()

describe('<VenueMapFiltersModal />', () => {
  it('should handle go back when pressing go back button when handleGoBack defined', async () => {
    render(
      <VenueMapFiltersModal
        titleId="uuid"
        title="Filtres"
        shouldDisplayBackButton
        shouldDisplayCloseButton
        handleOnClose={mockHandleOnClose}
        handleGoBack={mockHandleGoBack}>
        <View />
      </VenueMapFiltersModal>
    )

    await user.press(screen.getByLabelText('Revenir en arrière'))

    expect(mockHandleGoBack).toHaveBeenCalledTimes(1)
  })

  it('should handle on close when pressing go back button when handleGoBack not defined', async () => {
    render(
      <VenueMapFiltersModal
        titleId="uuid"
        title="Filtres"
        shouldDisplayBackButton
        shouldDisplayCloseButton
        handleOnClose={mockHandleOnClose}>
        <View />
      </VenueMapFiltersModal>
    )

    await user.press(screen.getByLabelText('Revenir en arrière'))

    expect(mockHandleOnClose).toHaveBeenCalledTimes(1)
  })
})
