import mockdate from 'mockdate'
import React from 'react'
import { Linking } from 'react-native'
import Share, { Social } from 'react-native-share'
import { UseQueryResult } from 'react-query'

import { useRoute } from '__mocks__/@react-navigation/native'
import { gtlPlaylistAlgoliaSnapshot } from 'features/gtlPlaylist/fixtures/gtlPlaylistAlgoliaSnapshot'
import * as useGTLPlaylists from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import * as useVenueOffers from 'features/venue/api/useVenueOffers'
import { VenueBody } from 'features/venue/components/VenueBody/VenueBody'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { VenueOffersResponseSnap } from 'features/venue/fixtures/venueOffersResponseSnap'
import { analytics } from 'libs/analytics'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { Network } from 'libs/share/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen } from 'tests/utils'

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

mockdate.set(new Date('2021-08-15T00:00:00Z'))

jest.mock('features/venue/api/useVenue')
jest.mock('@react-native-clipboard/clipboard')
const mockShareSingle = jest.spyOn(Share, 'shareSingle')
const canOpenURLSpy = jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false)
jest
  .spyOn(useGTLPlaylists, 'useGTLPlaylists')
  .mockReturnValue({ isLoading: false, gtlPlaylists: gtlPlaylistAlgoliaSnapshot })
jest.spyOn(useVenueOffers, 'useVenueOffers').mockReturnValue({
  isLoading: false,
  data: { hits: VenueOffersResponseSnap, nbHits: 10 },
} as unknown as UseQueryResult<useVenueOffers.VenueOffers, unknown>)

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

  it('should display withdrawal details', async () => {
    render(reactQueryProviderHOC(<VenueBody venue={venueDataTest} />))
    await waitUntilRendered()

    fireEvent.press(screen.getByText('Infos pratiques'))

    expect(screen.getByText('How to withdraw, https://test.com')).toBeOnTheScreen()
  })

  it('should share on Instagram', async () => {
    render(reactQueryProviderHOC(<VenueBody venue={venueDataTest} />))

    const instagramButton = await screen.findByText(`Envoyer sur ${Network.instagram}`)

    fireEvent.press(instagramButton)

    expect(mockShareSingle).toHaveBeenCalledWith({
      social: Social.Instagram,
      message: encodeURIComponent(
        `Retrouve "${venueDataTest.name}" sur le pass Culture\u00a0:\nhttps://webapp-v2.example.com/lieu/5543?utm_gen=product&utm_campaign=share_venue&utm_medium=social_media&utm_source=Instagram`
      ),
      type: 'text',
      url: undefined,
    })
  })

  it('should log event when pressing on Infos pratiques tab', async () => {
    render(reactQueryProviderHOC(<VenueBody venue={venueDataTest} />))
    await waitUntilRendered()

    fireEvent.press(screen.getByText('Infos pratiques'))

    expect(analytics.logConsultPracticalInformations).toHaveBeenCalledWith({
      venueId: venueDataTest.id,
    })
  })

  it('should log event when pressing on Offres disponibles tab', async () => {
    render(reactQueryProviderHOC(<VenueBody venue={venueDataTest} />))
    await waitUntilRendered()

    fireEvent.press(screen.getByText('Offres disponibles'))

    expect(analytics.logConsultVenueOffers).toHaveBeenCalledWith({ venueId: venueDataTest.id })
  })
})

const waitUntilRendered = async () => {
  // We wait until the full render is done
  // This is due to asynchronous calls to check the media on the phone
  await screen.findByText(`Envoyer sur ${Network.instagram}`)
}
