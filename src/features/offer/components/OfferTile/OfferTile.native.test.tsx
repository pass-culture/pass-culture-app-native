import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { push } from '__mocks__/@react-navigation/native'
import { CategoryIdEnum, HomepageLabelNameEnumv2, RecommendationApiParams } from 'api/gen'
import { Referrals } from 'features/navigation/RootNavigator/types'
import { PlaylistType } from 'features/offer/enums'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { analytics } from 'libs/analytics'
import { queryCache, reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen } from 'tests/utils'

import { OfferTile } from './OfferTile'

const OFFER = mockedAlgoliaResponse.hits[0].offer
const OFFER_LOCATION = mockedAlgoliaResponse.hits[0]._geoloc
const OFFER_ID = 116656
const searchId = uuidv4()

const apiRecoParams: RecommendationApiParams = {
  call_id: '1',
  filtered: true,
  geo_located: false,
  model_endpoint: 'default',
  model_name: 'similar_offers_default_prod',
  model_version: 'similar_offers_clicks_v2_1_prod_v_20230317T173445',
  reco_origin: 'default',
}

const props = {
  analyticsFrom: 'home' as Referrals,
  categoryLabel: HomepageLabelNameEnumv2.MUSIQUE,
  categoryId: CategoryIdEnum.MUSIQUE_LIVE,
  subcategoryId: OFFER.subcategoryId,
  expenseDomains: [],
  offerLocation: OFFER_LOCATION,
  date: 'Dès le 12 mars 2020',
  name: OFFER.name,
  isDuo: OFFER.isDuo,
  offerId: OFFER_ID,
  price: '28 €',
  thumbUrl: OFFER.thumbUrl,
  moduleName: 'Module Name',
  width: 100,
  height: 100,
}

describe('OfferTile component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', () => {
    render(reactQueryProviderHOC(<OfferTile {...props} />))

    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('should navigate to the offer when clicking on the image', async () => {
    render(reactQueryProviderHOC(<OfferTile {...props} />))
    await fireEvent.press(screen.getByTestId('tileImage'))

    expect(push).toHaveBeenCalledWith('Offer', {
      id: OFFER_ID,
      from: 'home',
      moduleName: 'Module Name',
    })
  })

  it('Analytics - should log ConsultOffer that user opened the offer', async () => {
    render(reactQueryProviderHOC(<OfferTile {...props} />))
    await fireEvent.press(screen.getByTestId('tileImage'))

    expect(analytics.logConsultOffer).toHaveBeenCalledWith({
      offerId: OFFER_ID,
      from: 'home',
      moduleName: props.moduleName,
    })
  })

  it('Analytics - should log ConsultOffer that user opened the offer from the list of similar offers', async () => {
    const propsFromSimilarOffers = {
      ...props,
      fromOfferId: 1,
      playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
      apiRecoParams,
    }

    render(
      reactQueryProviderHOC(
        <OfferTile {...propsFromSimilarOffers} offerLocation={OFFER_LOCATION} />
      )
    )
    await fireEvent.press(screen.getByTestId('tileImage'))

    expect(analytics.logConsultOffer).toHaveBeenCalledWith({
      ...apiRecoParams,
      offerId: OFFER_ID,
      from: 'similar_offer',
      moduleName: props.moduleName,
      fromOfferId: 1,
      playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
    })
  })

  it('Analytics - should log ConsultOffer with homeEntryId if provide', async () => {
    render(reactQueryProviderHOC(<OfferTile {...props} homeEntryId="abcd" />))
    fireEvent.press(screen.getByTestId('tileImage'))

    expect(analytics.logConsultOffer).toHaveBeenCalledWith({
      offerId: OFFER_ID,
      from: 'home',
      moduleName: props.moduleName,
      homeEntryId: 'abcd',
    })
  })

  it('Analytics - should log ConsultOffer from venue offers playlist and from search venues playlist', async () => {
    const propsFromSearchVenuesPlaylist = {
      offerId: OFFER_ID,
      analyticsFrom: 'venue' as Referrals,
      venueId: 1,
      searchId,
      categoryLabel: HomepageLabelNameEnumv2.MUSIQUE,
      categoryId: CategoryIdEnum.MUSIQUE_LIVE,
      subcategoryId: OFFER.subcategoryId,
      price: '28 €',
      width: 100,
      height: 100,
      thumbUrl: OFFER.thumbUrl,
    }

    render(
      reactQueryProviderHOC(
        <OfferTile {...propsFromSearchVenuesPlaylist} offerLocation={OFFER_LOCATION} />
      )
    )
    await fireEvent.press(screen.getByTestId('tileImage'))

    expect(analytics.logConsultOffer).toHaveBeenCalledWith({
      offerId: OFFER_ID,
      from: 'venue',
      venueId: 1,
      searchId,
    })
  })

  it('Analytics - should log ConsultOffer that user opened the offer from the list of same artist', async () => {
    const propsFromSimilarOffers = {
      ...props,
      fromOfferId: 1,
      playlistType: PlaylistType.SAME_ARTIST_PLAYLIST,
      apiRecoParams,
    }

    render(reactQueryProviderHOC(<OfferTile {...propsFromSimilarOffers} />))
    await fireEvent.press(screen.getByTestId('tileImage'))

    expect(analytics.logConsultOffer).toHaveBeenCalledWith({
      ...apiRecoParams,
      offerId: OFFER_ID,
      fromOfferId: 1,
      from: 'same_artist_playlist',
      moduleName: props.moduleName,
      playlistType: PlaylistType.SAME_ARTIST_PLAYLIST,
    })
  })

  it('should prepopulate react-query cache when clicking on offer', async () => {
    render(reactQueryProviderHOC(<OfferTile {...props} />))
    await fireEvent.press(screen.getByTestId('tileImage'))

    const queryHash = JSON.stringify(['offer', OFFER_ID])
    const query = queryCache.get(queryHash)

    expect(query).not.toBeUndefined()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(query!.state.data).toStrictEqual({
      accessibility: {},
      description: '',
      expenseDomains: [],
      id: OFFER_ID,
      images: { recto: { url: props.thumbUrl } },
      isDigital: false,
      isDuo: false,
      isReleased: true,
      isExpired: false,
      isForbiddenToUnderage: false,
      isSoldOut: false,
      name: OFFER.name,
      stocks: [],
      subcategoryId: OFFER.subcategoryId,
      venue: { coordinates: {} },
      isEducational: false,
      metadata: undefined,
      isExternalBookingsDisabled: false,
    })
  })
})
