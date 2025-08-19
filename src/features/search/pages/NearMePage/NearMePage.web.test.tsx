import React from 'react'

import algoliasearch from '__mocks__/algoliasearch'
import { mockAlgoliaResponse } from 'libs/algolia/fetchAlgolia/multipleQueries/__test__/mockAlgoliaResponse'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render, screen } from 'tests/utils/web'
import { waitForPromiseResolution } from 'tests/waitForPromiseResolution'

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

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<NearMePage />))

      const offerName = offerNearMeHits[0].offer.name
      await screen.findByText(offerName)
      await waitForPromiseResolution()

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
