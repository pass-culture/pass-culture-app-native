import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { push } from '__mocks__/@react-navigation/native'
import { CategoryIdEnum, HomepageLabelNameEnumv2 } from 'api/gen'
import { Referrals } from 'features/navigation/RootNavigator/types'
import { PlaylistType } from 'features/offerv2/enums'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { analytics } from 'libs/analytics'
import { RecommendationApiParams } from 'shared/offer/types'
import { queryCache, reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen } from 'tests/utils'

import { OfferTile } from './OfferTile'

// @ts-expect-error: because of noUncheckedIndexedAccess
const offer = mockedAlgoliaResponse.hits[0].offer
const offerId = 116656
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
  subcategoryId: offer.subcategoryId,
  expenseDomains: [],
  distance: '1,2km',
  date: 'Dès le 12 mars 2020',
  name: offer.name,
  isDuo: offer.isDuo,
  offerId,
  price: '28 €',
  thumbUrl: offer.thumbUrl,
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
      id: offerId,
      from: 'home',
      moduleName: 'Module Name',
    })
  })

  it('Analytics - should log ConsultOffer that user opened the offer', async () => {
    render(reactQueryProviderHOC(<OfferTile {...props} />))
    await fireEvent.press(screen.getByTestId('tileImage'))

    expect(analytics.logConsultOffer).toHaveBeenCalledWith({
      offerId,
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

    render(reactQueryProviderHOC(<OfferTile {...propsFromSimilarOffers} />))
    await fireEvent.press(screen.getByTestId('tileImage'))

    expect(analytics.logConsultOffer).toHaveBeenCalledWith({
      ...apiRecoParams,
      offerId,
      from: 'similar_offer',
      moduleName: props.moduleName,
      fromOfferId: 1,
      playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
    })
  })

  it('Analytics - should log ConsultOffer with homeEntryId if provide', async () => {
    render(reactQueryProviderHOC(<OfferTile {...props} homeEntryId="abcd" />))
    await fireEvent.press(screen.getByTestId('tileImage'))

    expect(analytics.logConsultOffer).toHaveBeenCalledWith({
      offerId,
      from: 'home',
      moduleName: props.moduleName,
      homeEntryId: 'abcd',
    })
  })

  it('Analytics - should log ConsultOffer from venue offers playlist and from search venues playlist', async () => {
    const propsFromSearchVenuesPlaylist = {
      offerId,
      analyticsFrom: 'venue' as Referrals,
      venueId: 1,
      searchId,
      categoryLabel: HomepageLabelNameEnumv2.MUSIQUE,
      categoryId: CategoryIdEnum.MUSIQUE_LIVE,
      subcategoryId: offer.subcategoryId,
      price: '28 €',
      width: 100,
      height: 100,
      thumbUrl: offer.thumbUrl,
    }

    render(reactQueryProviderHOC(<OfferTile {...propsFromSearchVenuesPlaylist} />))
    await fireEvent.press(screen.getByTestId('tileImage'))

    expect(analytics.logConsultOffer).toHaveBeenCalledWith({
      offerId,
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
      offerId,
      fromOfferId: 1,
      from: 'same_artist_playlist',
      moduleName: props.moduleName,
      playlistType: PlaylistType.SAME_ARTIST_PLAYLIST,
    })
  })

  it('should prepopulate react-query cache when clicking on offer', async () => {
    render(reactQueryProviderHOC(<OfferTile {...props} />))
    await fireEvent.press(screen.getByTestId('tileImage'))

    const queryHash = JSON.stringify(['offer', offerId])
    const query = queryCache.get(queryHash)

    expect(query).not.toBeUndefined()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(query!.state.data).toStrictEqual({
      accessibility: {},
      description: '',
      expenseDomains: [],
      id: offerId,
      image: { url: props.thumbUrl },
      isDigital: false,
      isDuo: false,
      isReleased: true,
      isExpired: false,
      isForbiddenToUnderage: false,
      isSoldOut: false,
      name: offer.name,
      stocks: [],
      subcategoryId: offer.subcategoryId,
      venue: { coordinates: {} },
      isEducational: false,
      metadata: undefined,
    })
  })
})
