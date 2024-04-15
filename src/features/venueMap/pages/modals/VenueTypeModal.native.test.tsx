import React from 'react'

import { VenueTypeCodeKey } from 'api/gen'
import { useVenueMapStore } from 'features/venueMap/context/useVenueMapStore'
import { VenueTypeModal } from 'features/venueMap/pages/modals/VenueTypeModal'
import { venuesFixture } from 'libs/algolia/fetchAlgolia/fetchVenues/fixtures/venuesFixture'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

const mockHideModal = jest.fn()

const mockSetVenueTypeCode = jest.fn()
jest.mock('features/venueMap/context/useVenueMapStore')
const mockUseVenueMapStore = useVenueMapStore as jest.MockedFunction<typeof useVenueMapStore>

describe('<VenueTypeModal />', () => {
  describe('When venue type is null', () => {
    beforeAll(() => {
      mockUseVenueMapStore.mockReturnValue({
        venueTypeCode: null,
        venues: venuesFixture,
        setVenueTypeCode: mockSetVenueTypeCode,
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
        expect(mockSetVenueTypeCode).toHaveBeenNthCalledWith(1, VenueTypeCodeKey.MOVIE)
      })
    })
  })

  describe('When venue type is not null', () => {
    beforeAll(() => {
      mockUseVenueMapStore.mockReturnValue({
        venueTypeCode: VenueTypeCodeKey.MOVIE,
        venues: [],
        setVenueTypeCode: mockSetVenueTypeCode,
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
