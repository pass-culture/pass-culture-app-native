import { DisplayedDisabilitiesEnum } from 'features/accessibility/enums'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { SearchQueryParameters } from 'libs/algolia/types'
import { env } from 'libs/environment/env'
import { LocationMode } from 'libs/location/types'

import { buildArtistsQuery } from './buildArtistsQuery'

describe('buildArtistsQuery', () => {
  const mockParams = {
    query: 'Daft Punk',
    page: 0,
  }
  const buildLocationParameterParams: BuildLocationParameterParams = {
    selectedLocationMode: LocationMode.EVERYWHERE,
    userLocation: null,
    aroundMeRadius: 0,
    aroundPlaceRadius: 0,
  }
  const mockDisabilities = {
    [DisplayedDisabilitiesEnum.AUDIO]: false,
    [DisplayedDisabilitiesEnum.MENTAL]: false,
    [DisplayedDisabilitiesEnum.MOTOR]: false,
    [DisplayedDisabilitiesEnum.VISUAL]: false,
  }

  it('should return a query object with specific artist attributes', () => {
    const query = buildArtistsQuery({
      parameters: mockParams as SearchQueryParameters,
      buildLocationParameterParams,
      isUserUnderage: false,
      disabilitiesProperties: mockDisabilities,
    })

    expect(query).toMatchObject({
      indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
      query: '',
      attributesToRetrieve: ['artists'],
      hitsPerPage: 100,
    })
  })
})
