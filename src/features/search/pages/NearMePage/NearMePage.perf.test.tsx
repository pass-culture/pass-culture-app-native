import React from 'react'

import algoliasearch from '__mocks__/algoliasearch'
import { mockAlgoliaResponse } from 'libs/algolia/fetchAlgolia/multipleQueries/__test__/mockAlgoliaResponse'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, measurePerformance } from 'tests/utils'

import { offerNearMeHits } from './fixtures/offerNearMeHits'
import { NearMePage } from './NearMePage'

jest.mock('libs/firebase/analytics/analytics')

const client = algoliasearch()
const index = client.initIndex()
index.search.mockResolvedValue(mockAlgoliaResponse(offerNearMeHits))

describe('<NearMePage />', () => {
  beforeAll(() => {
    setFeatureFlags()
  })

  it('Performance test for NearMePage page', async () => {
    await measurePerformance(reactQueryProviderHOC(<NearMePage />), {
      scenario: async () => {
        await act(async () => {})
      },
    })
  })
})
