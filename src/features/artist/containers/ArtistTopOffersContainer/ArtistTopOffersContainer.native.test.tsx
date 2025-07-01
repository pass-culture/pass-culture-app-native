import React from 'react'

import * as multipleQueriesAPI from 'libs/algolia/fetchAlgolia/multipleQueries'
import { mockAlgoliaResponse } from 'libs/algolia/fetchAlgolia/multipleQueries/__test__/mockAlgoliaResponse'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen } from 'tests/utils'

import { mockArtist } from '../../fixtures/mockArtist'

import { ArtistTopOffersContainer } from './ArtistTopOffersContainer'

jest.mock('libs/firebase/analytics/analytics')

const spyOnMultipleQueries = jest
  .spyOn(multipleQueriesAPI, 'multipleQueries')
  .mockResolvedValue([
    mockAlgoliaResponse(mockedAlgoliaOffersWithSameArtistResponse),
    mockAlgoliaResponse([...mockedAlgoliaOffersWithSameArtistResponse].splice(0, 4)),
  ])

describe('ArtistTopOffersContainer', () => {
  beforeEach(() => {
    setFeatureFlags([])
    mockServer.getApi('/v1/subcategories/v2', subcategoriesDataTest)
    mockServer.getApi(`/v1/artists/${mockArtist.id}`, mockArtist)
  })

  it('should display top offers when there is some offer from this artist', async () => {
    render(reactQueryProviderHOC(<ArtistTopOffersContainer artistId={mockArtist.id} />))

    expect(await screen.findByText('Ses oeuvres populaires')).toBeOnTheScreen()
  })

  it('should not display top offers when there is not some offer from this artist', async () => {
    spyOnMultipleQueries.mockResolvedValueOnce([
      mockAlgoliaResponse(mockedAlgoliaOffersWithSameArtistResponse),
      mockAlgoliaResponse([]),
    ])

    render(reactQueryProviderHOC(<ArtistTopOffersContainer artistId={mockArtist.id} />))

    await act(async () => {})

    expect(screen.queryByText('Ses oeuvres populaires')).not.toBeOnTheScreen()
  })

  it('should display subtitles when bookFormat is defined', async () => {
    render(reactQueryProviderHOC(<ArtistTopOffersContainer artistId={mockArtist.id} />))

    expect(await screen.findByText('Poche')).toBeOnTheScreen()
  })

  it('should not display subtitles when bookFormat is not defined', async () => {
    spyOnMultipleQueries.mockResolvedValueOnce([
      mockAlgoliaResponse(mockedAlgoliaOffersWithSameArtistResponse),
      mockAlgoliaResponse([mockedAlgoliaOffersWithSameArtistResponse[1]]),
    ])

    render(reactQueryProviderHOC(<ArtistTopOffersContainer artistId={mockArtist.id} />))

    await act(async () => {})

    expect(screen.queryByText('Broché')).not.toBeOnTheScreen()
  })

  describe('Request status', () => {
    it('should display nothing when there is and error', async () => {
      mockServer.getApi(`/v1/artists/${mockArtist.id}`, {
        responseOptions: {
          statusCode: 404,
          data: {},
        },
      })
      render(reactQueryProviderHOC(<ArtistTopOffersContainer artistId={mockArtist.id} />))

      await act(async () => {})

      expect(screen.queryByText('Ses oeuvres populaires')).not.toBeOnTheScreen()
    })

    it('should display skeleton when loading', async () => {
      render(reactQueryProviderHOC(<ArtistTopOffersContainer artistId={mockArtist.id} />))

      expect(screen.getByTestId('OfferPlaylistSkeleton')).toBeOnTheScreen()

      await act(() => {}) // the components re-render at the end of loading, this test focus on the loading part, ignore the others re-renders
    })
  })
})
