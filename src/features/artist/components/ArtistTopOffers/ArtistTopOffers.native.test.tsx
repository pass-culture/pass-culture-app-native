import React from 'react'

import { ArtistTopOffers } from 'features/artist/components/ArtistTopOffers/ArtistTopOffers'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

describe('ArtistTopOffers', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_NEW_HOME_MODULE_SIZES])
  })

  it('should display top offers when there is some offer from this artist', () => {
    render(
      <ArtistTopOffers artistName="Céline Dion" items={mockedAlgoliaOffersWithSameArtistResponse} />
    )

    expect(screen.getByText('Ses oeuvres populaires')).toBeOnTheScreen()
  })

  it('should not display top offers when there is not some offer from this artist', async () => {
    render(<ArtistTopOffers artistName="Céline Dion" items={[]} />)

    expect(screen.queryByText('Ses oeuvres populaires')).not.toBeOnTheScreen()
  })

  it('should display subtitles when bookFormat is defined', () => {
    render(
      <ArtistTopOffers
        artistName="Eiichiro Oda"
        items={[mockedAlgoliaOffersWithSameArtistResponse[0]]}
      />
    )

    expect(screen.getByText('Poche')).toBeOnTheScreen()
  })

  it('should not display subtitles when bookFormat is not defined', () => {
    render(
      <ArtistTopOffers
        artistName="Eiichiro Oda"
        items={[mockedAlgoliaOffersWithSameArtistResponse[1]]}
      />
    )

    expect(screen.queryByText('Broché')).not.toBeOnTheScreen()
  })
})
