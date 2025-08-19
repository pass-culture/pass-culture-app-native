import React from 'react'

import algoliasearch from '__mocks__/algoliasearch'
import { mockAlgoliaResponse } from 'libs/algolia/fetchAlgolia/multipleQueries/__test__/mockAlgoliaResponse'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'
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

  describe('Request status', () => {
    it('should display skeleton when loading', async () => {
      render(reactQueryProviderHOC(<NearMePage />))

      expect(screen.getByTestId('OfferPlaylistSkeleton')).toBeOnTheScreen()

      await waitForPromiseResolution() // the components re-render at the end of loading, this test focus on the loading part, ignore the others re-renders
    })

    it('should display not found page when there is an error', async () => {
      index.search.mockResolvedValueOnce(new Error())

      render(reactQueryProviderHOC(<NearMePage />))

      expect(await screen.findByText('Page introuvable !')).toBeOnTheScreen()
    })
  })

  it('should display NearMePage', async () => {
    render(reactQueryProviderHOC(<NearMePage />))

    await screen.findByText('Les offres autour de moi')

    expect(screen).toMatchSnapshot()
  })
})
