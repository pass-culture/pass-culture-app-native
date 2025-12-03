import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { buildVideoCarouselOffersQueries } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/buildVideoCarouselOffersQueries'
import { LocationMode } from 'libs/algolia/types'

describe('buildVideoCarouselOffersQueries', () => {
  const userLocation = {
    latitude: 48.8566,
    longitude: 2.3522,
  }
  const buildLocationParameterParams: BuildLocationParameterParams = {
    userLocation,
    selectedLocationMode: LocationMode.AROUND_ME,
    aroundMeRadius: 'all',
    aroundPlaceRadius: 'all',
  }

  const isUserUnderage = false

  const mockOfferId = '1234'
  const mockTag = 'furiosa'

  const expectedResultWithOfferId = {
    indexName: 'algoliaOffersIndexName',
    aroundLatLng: '48.8566, 2.3522',
    aroundRadius: 'all',
    facetFilters: [['offer.isEducational:false'], ['objectID:1234']],
    numericFilters: [['offer.prices:0 TO 300']],
    attributesToHighlight: [],
    attributesToRetrieve: offerAttributesToRetrieve,
    query: '',
  }

  const expectedResultWithTag = {
    indexName: 'algoliaOffersIndexName',
    aroundLatLng: '48.8566, 2.3522',
    aroundRadius: 'all',
    facetFilters: [['offer.isEducational:false'], ['offer.tags:furiosa']],
    numericFilters: [['offer.prices:0 TO 300']],
    attributesToHighlight: [],
    attributesToRetrieve: offerAttributesToRetrieve,
    query: '',
  }

  it('should return an offer query with objectIds facetfilter', () => {
    const queries = buildVideoCarouselOffersQueries({
      offerId: mockOfferId,
      locationParams: buildLocationParameterParams,
      isUserUnderage,
    })

    expect(queries).toEqual(expectedResultWithOfferId)
  })

  it('should return an offer query with tags facetfilter', () => {
    const queries = buildVideoCarouselOffersQueries({
      tag: mockTag,
      locationParams: buildLocationParameterParams,
      isUserUnderage,
    })

    expect(queries).toEqual(expectedResultWithTag)
  })
})
