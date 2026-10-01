import React from 'react'

import { Color } from 'features/home/types'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { Offer } from 'shared/offer/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

import { ArtistEditorialModule, ArtistEditorialModuleProps } from './ArtistEditorialModule'

const mockHitsItems: Offer[] = [
  mockedAlgoliaResponse.hits[0],
  mockedAlgoliaResponse.hits[1],
  mockedAlgoliaResponse.hits[2],
  {
    ...mockedAlgoliaResponse.hits[3],
    offer: { ...mockedAlgoliaResponse.hits[3].offer, name: 'The best album' },
  },
]
const mockNbHits = mockHitsItems.length
const mockData = {
  playlistItems: mockHitsItems,
  nbPlaylistResults: mockNbHits,
  moduleId: 'fakeModuleId',
}

const defaultProps: ArtistEditorialModuleProps = {
  title: 'Son incroyable discographie',
  moduleId: '5WgvNwbkdDj4BmtwYwWc9e',
  color: Color.Information04,
  illustration: 'MusicSheet',
  offersModuleParameters: [],
  data: mockData,
}

describe('ArtistEditorialModule', () => {
  it('should render correctly with title', () => {
    renderModule(defaultProps)

    expect(screen.getByText('Son incroyable discographie')).toBeOnTheScreen()
    expect(screen.getByTestId('mobileArtistEditorial')).toBeOnTheScreen()
  })

  it('should render up to 3 offer tiles after layout event', async () => {
    renderModule(defaultProps)

    expect(await screen.findByText('La nuit des temps')).toBeOnTheScreen()
    expect(screen.getByText('I want something more')).toBeOnTheScreen()
    expect(screen.getByText('Un lit sous une rivière')).toBeOnTheScreen()
    expect(screen.queryByText('The best album')).not.toBeOnTheScreen()
  })

  it('should render desktop layout when viewport is desktop', () => {
    renderModule(defaultProps, true)

    expect(screen.getByTestId('desktopArtistEditorial')).toBeOnTheScreen()
  })
})

const renderModule = (props: ArtistEditorialModuleProps, isDesktopViewport?: boolean) =>
  render(reactQueryProviderHOC(<ArtistEditorialModule {...props} />), {
    theme: { isDesktopViewport: isDesktopViewport ?? false },
  })
