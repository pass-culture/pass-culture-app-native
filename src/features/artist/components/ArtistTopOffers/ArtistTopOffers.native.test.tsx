import React from 'react'

import { ArtistTopOffers } from 'features/artist/components/ArtistTopOffers/ArtistTopOffers'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)
jest.mock('libs/firebase/analytics/analytics')

describe('ArtistPlaylist', () => {
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
})
