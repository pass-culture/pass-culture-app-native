import React from 'react'

import { ArtistTopOffers } from 'features/artist/components/ArtistTopOffers/ArtistTopOffers'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()

describe('ArtistTopOffers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    setFeatureFlags()
  })

  it('should display top offers when there is some offer from this artist', () => {
    render(
      reactQueryProviderHOC(
        <ArtistTopOffers
          artistName="Céline Dion"
          items={mockedAlgoliaOffersWithSameArtistResponse}
        />
      )
    )

    expect(screen.getByLabelText('Ses oeuvres populaires')).toBeOnTheScreen()
    expect(screen.getByText('Manga one piece t91')).toBeOnTheScreen()
  })

  it('should display top offers in an horizontal carousel', () => {
    render(
      reactQueryProviderHOC(
        <ArtistTopOffers
          artistName="Céline Dion"
          items={mockedAlgoliaOffersWithSameArtistResponse}
        />
      )
    )

    expect(screen.getByTestId('offersModuleList').props.horizontal).toBe(true)
  })

  it('should trigger analytics when we click on "Voir tout" button', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistTopOffers
          artistName="Céline Dion"
          items={mockedAlgoliaOffersWithSameArtistResponse}
        />
      )
    )

    await user.press(screen.getByText('Voir tout'))

    expect(analytics.logClickSeeAll).toHaveBeenCalledWith({
      type: 'artists',
      moduleName: 'Ses oeuvres populaires',
      from: 'artist',
    })
  })

  it('should display at most 4 top offers', () => {
    render(
      reactQueryProviderHOC(
        <ArtistTopOffers
          artistName="Céline Dion"
          items={mockedAlgoliaOffersWithSameArtistResponse}
        />
      )
    )

    expect(screen.getByText('Manga Série "One piece" - Tome 3')).toBeOnTheScreen()
    expect(screen.queryByText('Manga Série "One piece" - Tome 4')).not.toBeOnTheScreen()
  })

  it('should not display top offers when there is not some offer from this artist', async () => {
    render(reactQueryProviderHOC(<ArtistTopOffers artistName="Céline Dion" items={[]} />))

    expect(screen.queryByLabelText('Ses oeuvres populaires')).not.toBeOnTheScreen()
  })

  it('should display subtitles when bookFormat is defined', () => {
    render(
      reactQueryProviderHOC(
        <ArtistTopOffers
          artistName="Eiichiro Oda"
          items={[mockedAlgoliaOffersWithSameArtistResponse[0]]}
        />
      )
    )

    expect(screen.getByText('Poche')).toBeOnTheScreen()
  })

  it('should display subcategory label when bookFormat is not defined', () => {
    render(
      reactQueryProviderHOC(
        <ArtistTopOffers
          artistName="Eiichiro Oda"
          items={[mockedAlgoliaOffersWithSameArtistResponse[1]]}
        />
      )
    )

    expect(screen.getByText('Livre')).toBeOnTheScreen()
  })

  it('should display pro advices tag when defined and pro advices AB testing segment is A and wipProReviewsPlaylist FF activated', () => {
    render(
      reactQueryProviderHOC(
        <ArtistTopOffers
          artistName="Eiichiro Oda"
          items={[
            {
              ...mockedAlgoliaOffersWithSameArtistResponse[1],
              offer: { ...mockedAlgoliaOffersWithSameArtistResponse[1].offer, proAdvicesCount: 1 },
            },
          ]}
          proAdvicesSegment="A"
          enableProAdvicesTag
        />
      )
    )

    expect(screen.getByText('1 avis')).toBeOnTheScreen()
  })

  it('should not display pro advices tag when defined and pro advices AB testing segment is B and wipProReviewsPlaylist FF activated', async () => {
    render(
      reactQueryProviderHOC(
        <ArtistTopOffers
          artistName="Eiichiro Oda"
          items={[
            {
              ...mockedAlgoliaOffersWithSameArtistResponse[1],
              offer: { ...mockedAlgoliaOffersWithSameArtistResponse[1].offer, proAdvicesCount: 1 },
            },
          ]}
          proAdvicesSegment="B"
          enableProAdvicesTag={false}
        />
      )
    )

    expect(screen.queryByText('1 avis')).not.toBeOnTheScreen()
  })
})
