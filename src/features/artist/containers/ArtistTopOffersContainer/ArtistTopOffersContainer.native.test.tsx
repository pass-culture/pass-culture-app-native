import React from 'react'

import { ArtistTopOffersContainer } from 'features/artist/containers/ArtistTopOffersContainer/ArtistTopOffersContainer'
import {
  mockedAlgoliaOffersWithSameArtistResponse,
  mockedAlgoliaResponse,
} from 'libs/algolia/fixtures/algoliaFixtures'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import * as fetchOffersByArtistAPI from 'queries/offer/fetchOffersByArtist'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
const multipleQueriesSpy = jest
  .spyOn(client, 'multipleQueries')
  .mockImplementation(Promise.resolve(mockedAlgoliaResponse))

const fetchOffersByArtistSpy = jest
  .spyOn(fetchOffersByArtistAPI, 'fetchOffersByArtist')
  .mockResolvedValue({
    playlistHits: mockedAlgoliaOffersWithSameArtistResponse,
    topOffersHits: mockedAlgoliaOffersWithSameArtistResponse.splice(0, 4),
  })

describe('ArtistTopOffersContainer', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should display top offers when there is some offer from this artist', () => {
    render(
      reactQueryProviderHOC(
        <ArtistTopOffersContainer
          artistName="Céline Dion"
          items={mockedAlgoliaOffersWithSameArtistResponse}
        />
      )
    )

    expect(screen.getByText('Ses oeuvres populaires')).toBeOnTheScreen()
  })

  it('should not display top offers when there is not some offer from this artist', async () => {
    render(reactQueryProviderHOC(<ArtistTopOffersContainer artistName="Céline Dion" items={[]} />))

    expect(screen.queryByText('Ses oeuvres populaires')).not.toBeOnTheScreen()
  })

  it('should display subtitles when bookFormat is defined', () => {
    render(
      reactQueryProviderHOC(
        <ArtistTopOffersContainer
          artistName="Eiichiro Oda"
          items={[mockedAlgoliaOffersWithSameArtistResponse[0]]}
        />
      )
    )

    expect(screen.getByText('Poche')).toBeOnTheScreen()
  })

  it('should not display subtitles when bookFormat is not defined', () => {
    render(
      reactQueryProviderHOC(
        <ArtistTopOffersContainer
          artistName="Eiichiro Oda"
          items={[mockedAlgoliaOffersWithSameArtistResponse[1]]}
        />
      )
    )

    expect(screen.queryByText('Broché')).not.toBeOnTheScreen()
  })

  describe('Request status', () => {
    it.only('should render null when there is and error', async () => {
      mockServer.getApi(`/v1/artists/${mockArtist.id}`, {
        responseOptions: {
          statusCode: 404,
          data: {},
        },
      })
      render(reactQueryProviderHOC(<ArtistTopOffersContainer artistId={mockArtist.id} />))

      expect(await screen.findByText('Page introuvable !')).toBeOnTheScreen()
    })

    it.only('should display loading page when loading', async () => {
      mockServer.getApi(`/v1/artists/${mockArtist.id}`, {
        responseOptions: {
          delay: 'infinite',
          statusCode: 200,
          data: {},
        },
      })

      render(reactQueryProviderHOC(<ArtistTopOffersContainer artistId={mockArtist.id} />))

      expect(screen.getByText('Chargement en cours...')).toBeOnTheScreen()

      await act(() => {}) // the components re-render at the end of loading, this test focus on the loading part, ignore the others re-renders
    })
  })
})
