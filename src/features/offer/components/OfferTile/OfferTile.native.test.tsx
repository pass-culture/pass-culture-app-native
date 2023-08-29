import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { push } from '__mocks__/@react-navigation/native'
import { CategoryIdEnum, HomepageLabelNameEnum } from 'api/gen'
import { Referrals } from 'features/navigation/RootNavigator/types'
import { PlaylistType } from 'features/offer/enums'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { analytics } from 'libs/analytics'
import { queryCache, reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen } from 'tests/utils'

import { OfferTile } from './OfferTile'

const offer = mockedAlgoliaResponse.hits[0].offer
const offerId = 116656
const searchId = uuidv4()

const props = {
  analyticsFrom: 'home' as Referrals,
  categoryLabel: HomepageLabelNameEnum.MUSIQUE,
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
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    render(reactQueryProviderHOC(<OfferTile {...props} />))
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('should navigate to the offer when clicking on the image', async () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    render(reactQueryProviderHOC(<OfferTile {...props} />))
    await fireEvent.press(screen.getByTestId('tileImage'))
    expect(push).toHaveBeenCalledWith('Offer', {
      id: offerId,
      from: 'home',
      moduleName: 'Module Name',
    })
  })

  it('Analytics - should log ConsultOffer that user opened the offer', async () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
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
      shouldUseAlgoliaRecommend: false,
      playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
    }
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    render(reactQueryProviderHOC(<OfferTile {...propsFromSimilarOffers} />))
    await fireEvent.press(screen.getByTestId('tileImage'))
    expect(analytics.logConsultOffer).toHaveBeenCalledWith({
      offerId,
      from: 'similar_offer',
      moduleName: props.moduleName,
      fromOfferId: 1,
      shouldUseAlgoliaRecommend: false,
      playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
    })
  })

  it('Analytics - should log ConsultOffer with homeEntryId if provide', async () => {
    render(
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      reactQueryProviderHOC(<OfferTile {...props} homeEntryId={'abcd'} />)
    )
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
      categoryLabel: HomepageLabelNameEnum.MUSIQUE,
      categoryId: CategoryIdEnum.MUSIQUE_LIVE,
      subcategoryId: offer.subcategoryId,
      price: '28 €',
      width: 100,
      height: 100,
      thumbUrl: offer.thumbUrl,
    }
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    render(reactQueryProviderHOC(<OfferTile {...propsFromSearchVenuesPlaylist} />))
    await fireEvent.press(screen.getByTestId('tileImage'))
    expect(analytics.logConsultOffer).toHaveBeenCalledWith({
      offerId,
      from: 'venue',
      venueId: 1,
      searchId,
    })
  })

  it('should prepopulate react-query cache when clicking on offer', async () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
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
    })
  })
})
