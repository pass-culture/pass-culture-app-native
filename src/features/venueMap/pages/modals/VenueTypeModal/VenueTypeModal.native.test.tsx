import React from 'react'

import { VenueTypeCodeKey } from 'api/gen'
import { VenueTypeModal } from 'features/venueMap/pages/modals/VenueTypeModal/VenueTypeModal'
import { useVenues } from 'features/venueMap/store/venuesStore'
import {
  useVenueTypeCode,
  useVenueTypeCodeActions,
} from 'features/venueMap/store/venueTypeCodeStore'
import { venuesFixture } from 'libs/algolia/fetchAlgolia/fetchVenues/fixtures/venuesFixture'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

const mockHideModal = jest.fn()

jest.mock('features/venueMap/store/venueTypeCodeStore')
const mockUseVenueTypeCode = useVenueTypeCode as jest.Mock
const mockSetVenueTypeCode = jest.fn()
const mockUseVenueTypeCodeActions = useVenueTypeCodeActions as jest.Mock
mockUseVenueTypeCodeActions.mockReturnValue({ setVenueTypeCode: mockSetVenueTypeCode })

jest.mock('features/venueMap/store/venuesStore')
const mockUseVenues = useVenues as jest.Mock

describe('<VenueTypeModal />', () => {
  describe('When venue type is null', () => {
    beforeAll(() => {
      mockUseVenueTypeCode.mockReturnValue(null)
      mockUseVenues.mockReturnValue(venuesFixture)
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

      expect(screen.getByText('Cinéma - Salle de projections')).toHaveProp('isSelected', false)

      fireEvent.press(screen.getByText('Cinéma - Salle de projections'))

      expect(screen.getByText('Cinéma - Salle de projections')).toHaveProp('isSelected', true)
    })

    it('should close the modal when pressing close button', async () => {
      render(<VenueTypeModal hideModal={mockHideModal} isVisible />)

      fireEvent.press(screen.getByTestId('Fermer'))

      expect(mockHideModal).toHaveBeenCalledTimes(1)
    })

    it('should filter on venue type code when pressing search button', async () => {
      render(<VenueTypeModal hideModal={mockHideModal} isVisible />)

      fireEvent.press(screen.getByText('Cinéma - Salle de projections'))

      fireEvent.press(screen.getByText('Rechercher'))

      await waitFor(() => {
        expect(mockHideModal).toHaveBeenCalledTimes(1)
      })
    })

    it('should close the modal when pressing search button', async () => {
      render(<VenueTypeModal hideModal={mockHideModal} isVisible />)

      fireEvent.press(screen.getByText('Cinéma - Salle de projections'))

      fireEvent.press(screen.getByText('Rechercher'))

      await waitFor(() => {
        expect(mockSetVenueTypeCode).toHaveBeenNthCalledWith(1, VenueTypeCodeKey.MOVIE)
      })
    })
  })

  describe('When venue type is not null', () => {
    beforeAll(() => {
      mockUseVenueTypeCode.mockReturnValue(VenueTypeCodeKey.MOVIE)
      mockUseVenues.mockReturnValue([])
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

      expect(screen.getByText('Cinéma - Salle de projections')).toHaveProp('isSelected', true)
    })
  })
})
