import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { VenueMapBlock } from 'features/venueMap/components/VenueMapBlock/VenueMapBlock'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

const mockRemoveSelectedVenue = jest.fn()
jest.mock('features/venueMap/store/selectedVenueStore', () => ({
  useSelectedVenueActions: () => ({
    removeSelectedVenue: mockRemoveSelectedVenue,
  }),
}))
const mockSetInitialVenues = jest.fn()
jest.mock('features/venueMap/store/initialVenuesStore', () => ({
  useInitialVenuesActions: () => ({
    setInitialVenues: mockSetInitialVenues,
  }),
}))

describe('<VenueMapBlock />', () => {
  describe('When wipAppV2VenueMapBlock feature flag activated', () => {
    beforeEach(() => {
      useFeatureFlagSpy.mockReturnValueOnce(true)
    })

    it('should not display title venue map', () => {
      render(<VenueMapBlock from="searchLanding" />)

      expect(screen.queryByText('Carte des lieux culturels')).not.toBeOnTheScreen()
    })

    it('should display Explore la carte in text card', () => {
      render(<VenueMapBlock from="searchLanding" />)

      expect(screen.getByText('Explore la carte')).toBeOnTheScreen()
    })

    it('should not display Explorer les lieux in text card', () => {
      render(<VenueMapBlock from="searchLanding" />)

      expect(screen.queryByText('Explorer les lieux')).not.toBeOnTheScreen()
    })
  })

  describe('When wipAppV2VenueMapBlock feature flag deactivated', () => {
    it('should display title venue map', () => {
      render(<VenueMapBlock from="searchLanding" />)

      expect(screen.getByText('Carte des lieux culturels')).toBeOnTheScreen()
    })

    it('should display Explorer les lieux in text card', () => {
      render(<VenueMapBlock from="searchLanding" />)

      expect(screen.getByText('Explorer les lieux')).toBeOnTheScreen()
    })

    it('should not display Explore la carte in text card', () => {
      render(<VenueMapBlock from="searchLanding" />)

      expect(screen.queryByText('Explore la carte')).not.toBeOnTheScreen()
    })
  })

  it('should reset selected venue in store', async () => {
    render(<VenueMapBlock from="searchLanding" />)

    fireEvent.press(screen.getByText('Explorer les lieux'))

    await waitFor(() => {
      expect(mockRemoveSelectedVenue).toHaveBeenCalledTimes(1)
    })
  })

  it('should reset initial venues in store', async () => {
    render(<VenueMapBlock from="searchLanding" />)

    fireEvent.press(screen.getByText('Explorer les lieux'))

    await waitFor(() => {
      expect(mockSetInitialVenues).toHaveBeenCalledTimes(1)
    })
  })

  it('should navigate to venue map screen', async () => {
    render(<VenueMapBlock from="searchLanding" />)

    fireEvent.press(screen.getByText('Explorer les lieux'))

    await waitFor(() => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'VenueMap', undefined)
    })
  })

  it('should trigger log ConsultVenueMap', async () => {
    render(<VenueMapBlock from="searchLanding" />)

    fireEvent.press(screen.getByText('Explorer les lieux'))

    await waitFor(() => {
      expect(analytics.logConsultVenueMap).toHaveBeenNthCalledWith(1, { from: 'searchLanding' })
    })
  })
})
