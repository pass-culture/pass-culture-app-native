import React from 'react'

import { ArtistTopOffers } from 'features/artist/components/ArtistTopOffers/ArtistTopOffers'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

describe('ArtistTopOffers', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_NEW_HOME_MODULE_SIZES])
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

    expect(screen.getByText('Ses offres populaires')).toBeOnTheScreen()
  })

  it('should not display top offers when there is not some offer from this artist', async () => {
    render(reactQueryProviderHOC(<ArtistTopOffers artistName="Céline Dion" items={[]} />))

    expect(screen.queryByText('Ses offres populaires')).not.toBeOnTheScreen()
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

  it('should not display subtitles when bookFormat is not defined', () => {
    render(
      reactQueryProviderHOC(
        <ArtistTopOffers
          artistName="Eiichiro Oda"
          items={[mockedAlgoliaOffersWithSameArtistResponse[1]]}
        />
      )
    )

    expect(screen.queryByText('Broché')).not.toBeOnTheScreen()
  })
})
