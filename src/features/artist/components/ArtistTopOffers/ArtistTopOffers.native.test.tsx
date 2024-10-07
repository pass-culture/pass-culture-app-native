import React from 'react'

import { ArtistTopOffers } from 'features/artist/components/ArtistTopOffers/ArtistTopOffers'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

describe('ArtistPlaylist', () => {
  it('should display top offers when there is some offer from this artist', () => {
    render(
      reactQueryProviderHOC(<ArtistTopOffers items={mockedAlgoliaOffersWithSameArtistResponse} />)
    )

    expect(screen.getByText('Ses offres populaires')).toBeOnTheScreen()
  })

  it('should not display top offers when there is not some offer from this artist', async () => {
    render(reactQueryProviderHOC(<ArtistTopOffers items={[]} />))

    expect(screen.queryByText('Ses offres populaires')).not.toBeOnTheScreen()
  })
})
