import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { VenueMapBlockProxy } from 'features/venueMap/components/VenueMapBlock/VenueMapBlockProxy'
import * as useVenueMapStore from 'features/venueMap/store/venueMapStore'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { userEvent, render, screen, waitFor } from 'tests/utils'

const removeSelectedVenueSpy = jest.spyOn(useVenueMapStore, 'removeSelectedVenue')

const setVenuesSpy = jest.spyOn(useVenueMapStore, 'setVenues')
const user = userEvent.setup()
jest.useFakeTimers()

describe('<VenueMapBlock />', () => {
  describe('When wipAppV2VenueMapBlock feature flag activated', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_APP_V2_VENUE_MAP_BLOCK])
    })

    it('should not display title venue map', () => {
      render(<VenueMapBlockProxy from="searchLanding" />)

      expect(screen.queryByText('Carte des lieux culturels')).not.toBeOnTheScreen()
    })

    it('should display Explore la carte in text card', () => {
      render(<VenueMapBlockProxy from="searchLanding" />)

      expect(screen.getByText('Explore la carte')).toBeOnTheScreen()
    })

    it('should not display Explorer les lieux in text card', () => {
      render(<VenueMapBlockProxy from="searchLanding" />)

      expect(screen.queryByText('Explorer les lieux')).not.toBeOnTheScreen()
    })
  })

  describe('When wipAppV2VenueMapBlock feature flag deactivated', () => {
    beforeEach(() => {
      setFeatureFlags()
    })

    it('should display title venue map', () => {
      render(<VenueMapBlockProxy from="searchLanding" />)

      expect(screen.getByText('Carte des lieux culturels')).toBeOnTheScreen()
    })

    it('should display Explorer les lieux in text card', () => {
      render(<VenueMapBlockProxy from="searchLanding" />)

      expect(screen.getByText('Explorer les lieux')).toBeOnTheScreen()
    })

    it('should not display Explore la carte in text card', () => {
      render(<VenueMapBlockProxy from="searchLanding" />)

      expect(screen.queryByText('Explore la carte')).not.toBeOnTheScreen()
    })
  })

  it('should reset selected venue in store', async () => {
    render(<VenueMapBlockProxy from="searchLanding" />)

    user.press(screen.getByText('Explorer les lieux'))

    await waitFor(() => {
      expect(removeSelectedVenueSpy).toHaveBeenCalledTimes(1)
    })
  })

  it('should reset initial venues in store', async () => {
    render(<VenueMapBlockProxy from="searchLanding" />)

    user.press(screen.getByText('Explorer les lieux'))

    await waitFor(() => {
      expect(setVenuesSpy).toHaveBeenCalledTimes(1)
    })
  })

  it('should navigate to venue map screen', async () => {
    render(<VenueMapBlockProxy from="searchLanding" />)

    user.press(screen.getByText('Explorer les lieux'))

    await waitFor(() => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'VenueMap', undefined)
    })
  })

  it('should trigger log ConsultVenueMap', async () => {
    render(<VenueMapBlockProxy from="searchLanding" />)

    user.press(screen.getByText('Explorer les lieux'))

    await waitFor(() => {
      expect(analytics.logConsultVenueMap).toHaveBeenNthCalledWith(1, { from: 'searchLanding' })
    })
  })
})
