import { buildFetchVenuesQueryParameters } from 'libs/algolia/fetchAlgolia/fetchVenues/buildFetchVenuesQueryParameters'
import { AlgoliaQueryParameters, FetchVenuesParameters } from 'libs/algolia/types'

describe('buildFetchVenuesQueryParameters', () => {
  it.each`
    params | expected
    ${{ query: 'myQuery' }} | ${{
  query: 'myQuery',
  requestOptions: { attributesToHighlight: [] },
}}
    ${{ query: '' }} | ${{
  query: '',
  requestOptions: { attributesToHighlight: [] },
}}
    ${{ query: 'myQuery', attributesToHighlight: undefined }} | ${{
  query: 'myQuery',
  requestOptions: { attributesToHighlight: [] },
}}
    ${{ query: 'myQuery', attributesToHighlight: ['myAttibuts1', 'myAttibuts2'] }} | ${{
  query: 'myQuery',
  requestOptions: { attributesToHighlight: ['myAttibuts1', 'myAttibuts2'] },
}}
  `(
    'should correcty format FetchVenues parameters : $params',
    ({ params, expected }: { params: FetchVenuesParameters; expected: AlgoliaQueryParameters }) => {
      const result = buildFetchVenuesQueryParameters(params)
      expect(result).toEqual(expected)
    }
  )
})
