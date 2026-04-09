import { DisplayedDisabilitiesEnum } from 'features/accessibility/enums'
import { SearchQueryParameters } from 'libs/algolia/types'
import { env } from 'libs/environment/env'
import { LocationMode } from 'libs/location/types'

import { buildVenuesQuery } from './buildVenuesQuery'

const mockDisabilities = {
  [DisplayedDisabilitiesEnum.AUDIO]: false,
  [DisplayedDisabilitiesEnum.MENTAL]: false,
  [DisplayedDisabilitiesEnum.MOTOR]: false,
  [DisplayedDisabilitiesEnum.VISUAL]: false,
}

const buildLocationParameterParams = {
  selectedLocationMode: LocationMode.EVERYWHERE,
  userLocation: null,
  aroundMeRadius: 0,
  aroundPlaceRadius: 0,
}

describe('buildVenuesQuery', () => {
  it('should return a query object for venues with 35 hits per page', () => {
    const query = buildVenuesQuery({
      parameters: { query: 'Cinema' } as SearchQueryParameters,
      buildLocationParameterParams,
      disabilitiesProperties: mockDisabilities,
    })

    expect(query).toMatchObject({
      query: 'Cinema',
      page: 0,
      hitsPerPage: 35,
      clickAnalytics: true,
    })
    expect(query.indexName).toBeDefined()
  })

  describe('buildVenuesQuery - Index Selection Logic', () => {
    it.each`
      selectedLocationMode       | geolocPosition             | expectedIndex
      ${LocationMode.EVERYWHERE} | ${null}                    | ${env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH_NEWEST}
      ${LocationMode.EVERYWHERE} | ${{ lat: 48.8, lng: 2.3 }} | ${env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH}
      ${LocationMode.AROUND_ME}  | ${null}                    | ${env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH}
      ${LocationMode.AROUND_ME}  | ${{ lat: 48.8, lng: 2.3 }} | ${env.ALGOLIA_VENUES_INDEX_PLAYLIST_SEARCH}
    `(
      'should fetch on $expectedIndex when location mode is $selectedLocationMode and geoloc is $geolocPosition',
      ({ selectedLocationMode, geolocPosition, expectedIndex }) => {
        const query = buildVenuesQuery({
          parameters: { query: 'Cinema' } as SearchQueryParameters,
          buildLocationParameterParams: {
            selectedLocationMode,
            geolocPosition,
            userLocation: null,
            aroundMeRadius: 'all',
            aroundPlaceRadius: 'all',
          },
          disabilitiesProperties: mockDisabilities,
        })

        expect(query.indexName).toBe(expectedIndex)
      }
    )
  })
})
