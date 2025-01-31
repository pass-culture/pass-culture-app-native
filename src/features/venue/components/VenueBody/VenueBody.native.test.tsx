import mockdate from 'mockdate'
import React from 'react'
import { Linking } from 'react-native'

import { useRoute } from '__mocks__/@react-navigation/native'
import { gtlPlaylistAlgoliaSnapshot } from 'features/gtlPlaylist/fixtures/gtlPlaylistAlgoliaSnapshot'
import * as useGTLPlaylists from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { VenueBody } from 'features/venue/components/VenueBody/VenueBody'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { VenueOffersResponseSnap } from 'features/venue/fixtures/venueOffersResponseSnap'
import { analytics } from 'libs/analytics/provider'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen } from 'tests/utils'

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

mockdate.set(new Date('2021-08-15T00:00:00Z'))

const canOpenURLSpy = jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false)
jest
  .spyOn(useGTLPlaylists, 'useGTLPlaylists')
  .mockReturnValue({ isLoading: false, gtlPlaylists: gtlPlaylistAlgoliaSnapshot })

jest.mock('features/venue/api/useVenueOffers')
const mockUseVenueOffers = useVenueOffers as jest.Mock
mockUseVenueOffers.mockReturnValue({
  isLoading: false,
  data: { hits: VenueOffersResponseSnap, nbHits: 10 },
})
jest.mock('libs/location')

jest.mock('libs/subcategories/useSubcategories')

const venueId = venueDataTest.id
useRoute.mockImplementation(() => ({ params: { id: venueId } }))

jest.mock('libs/firebase/analytics/analytics')

describe('<VenueBody />', () => {
  beforeEach(() => {
    // We mock only the first call to canOpenURL so we can wait for instagram to be displayed
    // This way we avoid act warning when the calls to openURL are made
    canOpenURLSpy.mockResolvedValueOnce(true)
  })

  it('should display expected tabs', async () => {
    render(reactQueryProviderHOC(<VenueBody venue={venueDataTest} />))

    expect(await screen.findByText('Offres disponibles')).toBeOnTheScreen()
    expect(await screen.findByText('Infos pratiques')).toBeOnTheScreen()
  })

  it('should display withdrawal details', async () => {
    render(reactQueryProviderHOC(<VenueBody venue={venueDataTest} />))

    fireEvent.press(screen.getByText('Infos pratiques'))

    expect(screen.getByText('How to withdraw, https://test.com')).toBeOnTheScreen()
  })

  it('should log event when pressing on Infos pratiques tab', async () => {
    render(reactQueryProviderHOC(<VenueBody venue={venueDataTest} />))

    fireEvent.press(screen.getByText('Infos pratiques'))

    expect(analytics.logConsultPracticalInformations).toHaveBeenCalledWith({
      venueId: venueDataTest.id,
    })
  })

  it('should log event when pressing on Offres disponibles tab', async () => {
    render(reactQueryProviderHOC(<VenueBody venue={venueDataTest} />))

    fireEvent.press(screen.getByText('Offres disponibles'))

    expect(analytics.logConsultVenueOffers).toHaveBeenCalledWith({ venueId: venueDataTest.id })
  })
})
