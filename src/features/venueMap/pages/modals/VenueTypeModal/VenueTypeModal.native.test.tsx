import React from 'react'

import { VenueTypeCodeKey } from 'api/gen'
import { VenueTypeModal } from 'features/venueMap/pages/modals/VenueTypeModal/VenueTypeModal'
import * as useVenueMapStore from 'features/venueMap/store/venueMapStore'
import { venuesFixture } from 'libs/algolia/fetchAlgolia/fetchVenues/fixtures/venuesFixture'
import { analytics } from 'libs/analytics/provider'
import { act, fireEvent, render, screen, userEvent, waitFor } from 'tests/utils'

const mockHideModal = jest.fn()

const setVenueTypeCodeSpy = jest.spyOn(useVenueMapStore, 'setVenueTypeCode')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<VenueTypeModal />', () => {
  const user = userEvent.setup()

  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe('When venue type is null', () => {
    beforeEach(() => {
      useVenueMapStore.setVenueTypeCode(null)
      useVenueMapStore.setVenues(venuesFixture)
    })

    it('should render modal correctly', () => {
      render(<VenueTypeModal hideModal={mockHideModal} isVisible />)

      expect(screen).toMatchSnapshot()
    })

    it('should select by default "Tout" option', () => {
      render(<VenueTypeModal hideModal={mockHideModal} isVisible />)

      expect(screen.getByText('Tout')).toHaveProp('isSelected', true)
    })

    it('should select an option when pressing it', async () => {
      render(<VenueTypeModal hideModal={mockHideModal} isVisible />)

      expect(screen.getByText('Cinéma - Salle de projections')).toHaveProp('isSelected', false)

      await user.press(screen.getByText('Cinéma - Salle de projections'))

      expect(screen.getByText('Cinéma - Salle de projections')).toHaveProp('isSelected', true)
    })

    it('should close the modal when pressing close button', async () => {
      render(<VenueTypeModal hideModal={mockHideModal} isVisible />)

      await user.press(screen.getByTestId('Fermer'))

      expect(mockHideModal).toHaveBeenCalledTimes(1)
    })

    it('should filter on venue type code when pressing search button', async () => {
      render(<VenueTypeModal hideModal={mockHideModal} isVisible />)

      await user.press(screen.getByText('Cinéma - Salle de projections'))

      await user.press(screen.getByText('Rechercher'))

      await waitFor(() => {
        expect(mockHideModal).toHaveBeenCalledTimes(1)
      })
    })

    it('should trigger ApplyVenueMapFilter log when pressing search button and venue type code selected', async () => {
      render(<VenueTypeModal hideModal={mockHideModal} isVisible />)

      await user.press(screen.getByText('Cinéma - Salle de projections'))

      await user.press(screen.getByText('Rechercher'))

      await waitFor(() => {
        expect(analytics.logApplyVenueMapFilter).toHaveBeenNthCalledWith(1, {
          venueType: 'Cinéma - Salle de projections',
        })
      })
    })

    it('should not trigger ApplyVenueMapFilter log when pressing search button and venue type code is "Tout"', async () => {
      render(<VenueTypeModal hideModal={mockHideModal} isVisible />)

      await user.press(screen.getByText('Tout'))

      await act(async () => {
        fireEvent.press(screen.getByText('Rechercher'))
      })

      expect(analytics.logApplyVenueMapFilter).not.toHaveBeenCalled()
    })

    it('should close the modal when pressing search button', async () => {
      render(<VenueTypeModal hideModal={mockHideModal} isVisible />)

      await user.press(screen.getByText('Cinéma - Salle de projections'))

      await user.press(screen.getByText('Rechercher'))

      await waitFor(() => {
        expect(setVenueTypeCodeSpy).toHaveBeenCalledWith(VenueTypeCodeKey.MOVIE)
      })
    })
  })

  describe('When venue type is not null', () => {
    beforeEach(() => {
      useVenueMapStore.setVenueTypeCode(VenueTypeCodeKey.MOVIE)
      useVenueMapStore.setVenues([])
    })

    it('should select "Tout" option when pressing reset button', async () => {
      render(<VenueTypeModal hideModal={mockHideModal} isVisible />)

      await user.press(screen.getByText('Réinitialiser'))

      expect(screen.getByText('Tout')).toHaveProp('isSelected', true)
    })

    it('should reset with state value when pressing close button', async () => {
      render(<VenueTypeModal hideModal={mockHideModal} isVisible />)

      await user.press(screen.getByText('Tout'))
      await user.press(screen.getByTestId('Fermer'))

      expect(screen.getByText('Cinéma - Salle de projections')).toHaveProp('isSelected', true)
    })
  })
})
