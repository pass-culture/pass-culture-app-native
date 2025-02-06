import React from 'react'
import { View } from 'react-native'

import { VenueMapFiltersModal } from 'features/venueMap/pages/modals/VenueMapFiltersModal/VenueMapFiltersModal'
import { venuesFilterActions } from 'features/venueMap/store/venuesFilterStore'
import { render, screen, userEvent } from 'tests/utils'

const mockHandleOnClose = jest.fn()
const mockHandleGoBack = jest.fn()

const mockResetFilters = jest.spyOn(venuesFilterActions, 'reset')

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

  it('should close the modal when pressing search button', async () => {
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

    await user.press(screen.getByText('Rechercher'))

    expect(mockHandleOnClose).toHaveBeenCalledTimes(1)
  })

  it('should reset the filters when pressing reset button', async () => {
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

    await user.press(screen.getByText('Réinitialiser'))

    expect(mockResetFilters).toHaveBeenCalledTimes(1)
  })
})
