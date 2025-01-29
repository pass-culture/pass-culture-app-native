import React from 'react'

import { VenueTypeCodeKey } from 'api/gen'
import { VenueTypeModal } from 'features/venueMap/pages/modals/VenueTypeModal/VenueTypeModal'
import { useVenues } from 'features/venueMap/store/venuesStore'
import { useVenueTypeCode, venueTypeCodeActions } from 'features/venueMap/store/venueTypeCodeStore'
import { venuesFixture } from 'libs/algolia/fetchAlgolia/fetchVenues/fixtures/venuesFixture'
import { analytics } from 'libs/analytics/provider'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'

const mockHideModal = jest.fn()

jest.mock('features/venueMap/store/venueTypeCodeStore')
const mockUseVenueTypeCode = useVenueTypeCode as jest.Mock
const mockSetVenueTypeCode = jest.spyOn(venueTypeCodeActions, 'setVenueTypeCode')

jest.mock('features/venueMap/store/venuesStore')
const mockUseVenues = useVenues as jest.Mock

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

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

    it('should trigger ApplyVenueMapFilter log when pressing search button and venue type code selected', async () => {
      render(<VenueTypeModal hideModal={mockHideModal} isVisible />)

      fireEvent.press(screen.getByText('Cinéma - Salle de projections'))

      fireEvent.press(screen.getByText('Rechercher'))

      await waitFor(() => {
        expect(analytics.logApplyVenueMapFilter).toHaveBeenNthCalledWith(1, {
          venueType: 'Cinéma - Salle de projections',
        })
      })
    })

    it('should not trigger ApplyVenueMapFilter log when pressing search button and venue type code is "Tout"', async () => {
      render(<VenueTypeModal hideModal={mockHideModal} isVisible />)

      fireEvent.press(screen.getByText('Tout'))

      await act(async () => {
        fireEvent.press(screen.getByText('Rechercher'))
      })

      expect(analytics.logApplyVenueMapFilter).not.toHaveBeenCalled()
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
