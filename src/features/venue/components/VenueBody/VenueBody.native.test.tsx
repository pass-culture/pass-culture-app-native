import mockdate from 'mockdate'
import React from 'react'
import { Linking } from 'react-native'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { CategoryIdEnum } from 'api/gen'
import { gtlPlaylistAlgoliaSnapshot } from 'features/gtlPlaylist/fixtures/gtlPlaylistAlgoliaSnapshot'
import * as useGTLPlaylists from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { VenueBody } from 'features/venue/components/VenueBody/VenueBody'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { VenueOffersResponseSnap } from 'features/venue/fixtures/venueOffersResponseSnap'
import * as useVenueSearchParameters from 'features/venue/helpers/useVenueSearchParameters'
import mockVenueSearchParams from 'fixtures/venueSearchParams'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

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

const HEADLINE_OFFER_DATA = {
  id: '1',
  categoryId: CategoryIdEnum.LIVRE,
  category: 'Livre',
  offerTitle: 'One Piece Tome 108',
  imageUrl: 'http://offer.jpg',
  price: '7,20€',
  distance: '500m',
}

jest
  .spyOn(useVenueSearchParameters, 'useVenueSearchParameters')
  .mockReturnValue(mockVenueSearchParams)

jest.mock('features/search/context/SearchWrapper')

jest.useFakeTimers()
const user = userEvent.setup()

describe('<VenueBody />', () => {
  beforeEach(() => {
    setFeatureFlags()
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

    await user.press(screen.getByText('Infos pratiques'))

    expect(screen.getByText('How to withdraw, https://test.com')).toBeOnTheScreen()
  })

  it('should log event when pressing on Infos pratiques tab', async () => {
    render(reactQueryProviderHOC(<VenueBody venue={venueDataTest} />))

    await user.press(screen.getByText('Infos pratiques'))

    expect(analytics.logConsultPracticalInformations).toHaveBeenCalledWith({
      venueId: venueDataTest.id,
    })
  })

  it('should log event when pressing on Offres disponibles tab', async () => {
    render(reactQueryProviderHOC(<VenueBody venue={venueDataTest} />))

    await user.press(screen.getByText('Offres disponibles'))

    expect(analytics.logConsultVenueOffers).toHaveBeenCalledWith({ venueId: venueDataTest.id })
  })

  it('should display the "À la une" section if headlineData is present', async () => {
    render(
      reactQueryProviderHOC(
        <VenueBody venue={venueDataTest} headlineOfferData={HEADLINE_OFFER_DATA} />
      )
    )

    expect(screen.getByText('À la une')).toBeOnTheScreen()
  })

  it('should navigate to headline offer when pressing on it', async () => {
    render(
      reactQueryProviderHOC(
        <VenueBody venue={venueDataTest} headlineOfferData={HEADLINE_OFFER_DATA} />
      )
    )

    await user.press(screen.getByText('One Piece Tome 108'))

    expect(navigate).toHaveBeenCalledWith('Offer', { id: HEADLINE_OFFER_DATA.id })
  })

  it('should trigger ConsultOffer log when pressing on headline offer', async () => {
    render(
      reactQueryProviderHOC(
        <VenueBody venue={venueDataTest} headlineOfferData={HEADLINE_OFFER_DATA} />
      )
    )

    await user.press(screen.getByText('One Piece Tome 108'))

    expect(analytics.logConsultOffer).toHaveBeenNthCalledWith(1, {
      offerId: Number(HEADLINE_OFFER_DATA.id),
      from: 'venue',
      venueId: venueDataTest.id,
      isHeadline: true,
    })
  })
})
