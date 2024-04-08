import React from 'react'

import { VenueTypeCodeKey } from 'api/gen'
import { VenueTypeModal } from 'features/venueMap/pages/modals/VenueTypeModal'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

const mockHideModal = jest.fn()

const mockDispatch = jest.fn()
const mockUseVenueMapState = jest.fn()
jest.mock('features/venueMap/context/VenueMapWrapper', () => ({
  useVenueMapState: () => mockUseVenueMapState(),
}))

describe('<VenueTypeModal />', () => {
  describe('When venue type is null', () => {
    beforeAll(() => {
      mockUseVenueMapState.mockReturnValue({
        venueMapState: { venueTypeCode: null },
        dispatch: mockDispatch,
      })
    })

    it('should render modal correctly', () => {
      render(<VenueTypeModal hideModal={mockHideModal} isVisible />)

      expect(screen).toMatchSnapshot()
    })

    it('should select by default "Tout" option', () => {
      render(<VenueTypeModal hideModal={mockHideModal} isVisible />)

      expect(screen.getByText('Tout')).toHaveProp('isSelected', true)
    })

    it('should select an option when pressing it', () => {
      render(<VenueTypeModal hideModal={mockHideModal} isVisible />)

      expect(screen.getByText('Cinémas - Salles de projection')).toHaveProp('isSelected', false)

      fireEvent.press(screen.getByText('Cinémas - Salles de projection'))

      expect(screen.getByText('Cinémas - Salles de projection')).toHaveProp('isSelected', true)
    })

    it('should close the modal when pressing close button', async () => {
      render(<VenueTypeModal hideModal={mockHideModal} isVisible />)

      fireEvent.press(screen.getByTestId('Fermer'))

      expect(mockHideModal).toHaveBeenCalledTimes(1)
    })

    it('should filter on venue type code when pressing search button', async () => {
      render(<VenueTypeModal hideModal={mockHideModal} isVisible />)

      fireEvent.press(screen.getByText('Cinémas - Salles de projection'))

      fireEvent.press(screen.getByText('Rechercher'))

      await waitFor(() => {
        expect(mockHideModal).toHaveBeenCalledTimes(1)
      })
    })

    it('should close the modal when pressing search button', async () => {
      render(<VenueTypeModal hideModal={mockHideModal} isVisible />)

      fireEvent.press(screen.getByText('Cinémas - Salles de projection'))

      fireEvent.press(screen.getByText('Rechercher'))

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenNthCalledWith(1, {
          type: 'SET_VENUE_TYPE_CODE',
          payload: VenueTypeCodeKey.MOVIE,
        })
      })
    })
  })

  describe('When venue type is not null', () => {
    beforeAll(() => {
      mockUseVenueMapState.mockReturnValue({
        venueMapState: { venueTypeCode: VenueTypeCodeKey.MOVIE },
        dispatch: mockDispatch,
      })
    })

    it('should select "Tout" option when pressing reset button', () => {
      render(<VenueTypeModal hideModal={mockHideModal} isVisible />)

      fireEvent.press(screen.getByText('Réinitialiser'))

      expect(screen.getByText('Tout')).toHaveProp('isSelected', true)
    })

    it('should reset with state value when pressing close button', () => {
      render(<VenueTypeModal hideModal={mockHideModal} isVisible />)

      fireEvent.press(screen.getByText('Tout'))

      expect(screen.getByText('Tout')).toHaveProp('isSelected', true)

      fireEvent.press(screen.getByTestId('Fermer'))

      expect(screen.getByText('Cinémas - Salles de projection')).toHaveProp('isSelected', true)
    })
  })
})
