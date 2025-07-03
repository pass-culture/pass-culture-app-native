import React from 'react'

import algoliasearch from '__mocks__/algoliasearch'
import { mockAlgoliaResponse } from 'libs/algolia/fetchAlgolia/multipleQueries/__test__/mockAlgoliaResponse'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render, screen } from 'tests/utils/web'

import { offerNearMeHits } from './fixtures/offerNearMeHits'
import { NearMePage } from './NearMePage'

jest.mock('libs/firebase/analytics/analytics')

const client = algoliasearch()
const index = client.initIndex()
index.search.mockResolvedValue(mockAlgoliaResponse(offerNearMeHits))

jest.mock('libs/location')

describe('<NearMePage />', () => {
  beforeAll(() => {
    setFeatureFlags()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<NearMePage />))

      await screen.findByText('Les offres autour de moi')

      const results = await act(async () => {
        return checkAccessibilityFor(container)
      })

      expect(results).toHaveNoViolations()
    })
  })
})
