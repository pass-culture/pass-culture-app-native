import React from 'react'

import { ArtistTopOffersContainer } from 'features/artist/containers/ArtistTopOffersContainer/ArtistTopOffersContainer'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

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
})
