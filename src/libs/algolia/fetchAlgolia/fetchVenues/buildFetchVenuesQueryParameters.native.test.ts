import { VenuesFacets } from 'libs/algolia/enums'
import { buildFetchVenuesQueryParameters } from 'libs/algolia/fetchAlgolia/fetchVenues/buildFetchVenuesQueryParameters'
import { AlgoliaQueryParameters, FetchVenuesParameters } from 'libs/algolia/types'

const facetFilters = [[`${VenuesFacets.has_at_least_one_bookable_offer}:true`]]

describe('buildFetchVenuesQueryParameters', () => {
  it.each`
    params | expected
    ${{ query: 'myQuery' }} | ${{
  query: 'myQuery',
  requestOptions: { attributesToHighlight: [], facetFilters },
}}
    ${{ query: '' }} | ${{
  query: '',
  requestOptions: { attributesToHighlight: [], facetFilters },
}}
    ${{ query: 'myQuery', attributesToHighlight: undefined }} | ${{
  query: 'myQuery',
  requestOptions: { attributesToHighlight: [], facetFilters },
}}
    ${{ query: 'myQuery', attributesToHighlight: ['myAttibuts1', 'myAttibuts2'], facetFilters }} | ${{
  query: 'myQuery',
  requestOptions: { attributesToHighlight: ['myAttibuts1', 'myAttibuts2'], facetFilters },
}}
  `(
    'should correcty format FetchVenues parameters : $params',
    ({ params, expected }: { params: FetchVenuesParameters; expected: AlgoliaQueryParameters }) => {
      const result = buildFetchVenuesQueryParameters(params)

      expect(result).toEqual(expected)
    }
  )
})
