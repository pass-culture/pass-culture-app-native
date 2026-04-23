import { LegacySearchMethodProps } from 'algoliasearch'
import { SearchMethodParams, SearchQuery } from 'algoliasearch/lite'

import { updateSearchMethodParams } from 'libs/algolia/fetchAlgolia/clients'

describe('updateSearchMethodParams', () => {
  it('Should inject analytics by default for non existing value', () => {
    const query: SearchQuery = { indexName: 'INDEX' }
    const params: SearchMethodParams = {
      requests: [query],
    }
    const updatedParams = updateSearchMethodParams(params)

    expect(updatedParams).toEqual({ requests: [{ indexName: 'INDEX', analytics: false }] })
  })

  it('Should not inject analytics if already included in the query', () => {
    const query: SearchQuery = { indexName: 'INDEX', analytics: true }
    const params: SearchMethodParams = {
      requests: [query],
    }
    const updatedParams = updateSearchMethodParams(params)

    expect(updatedParams).toEqual({ requests: [{ indexName: 'INDEX', analytics: true }] })
  })

  it('Should inject analytics in the query for legacy queries', () => {
    const query = { indexName: 'INDEX' } // the type here is LegacySearchQuery but it's not exported from algolia's lib
    const params: LegacySearchMethodProps = [query]
    const updatedParams = updateSearchMethodParams(params)

    expect(updatedParams).toEqual([{ indexName: 'INDEX', params: { analytics: false } }])
  })

  it('Should not inject analytics in the query if already included in legacy queries', () => {
    const query = { indexName: 'INDEX', params: { analytics: true } } // the type here is LegacySearchQuery but it's not exported from algolia's lib
    const params: LegacySearchMethodProps = [query]
    const updatedParams = updateSearchMethodParams(params)

    expect(updatedParams).toEqual([{ indexName: 'INDEX', params: { analytics: true } }])
  })
})
