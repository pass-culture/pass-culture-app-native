import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/analytics/provider'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

import { VerticalPlaylistArtists } from './VerticalPlaylistArtists'

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({ searchState: { query: '', searchId: '1' }, resetSearch: jest.fn() }),
}))

jest.mock('shared/verticalPlaylist/helpers/useGetArtistsFromPlaylist', () => ({
  useGetArtistsFromPlaylist: () => ({
    title: 'Rock Legends',
    subtitle: 'The best rock artists',
    items: [
      { id: '1', name: 'Queen' },
      { id: '2', name: 'Led Zeppelin' },
    ],
    nbItems: 2,
  }),
}))

const user = userEvent.setup()

jest.useFakeTimers()

describe('VerticalPlaylistArtists', () => {
  beforeEach(() => {
    useRoute.mockReturnValue({ params: { originDetails: 'offer' } })
  })

  it('should render correclty', () => {
    renderVerticalPlaylistArtists()

    expect(screen.getAllByText('Rock Legends')[0]).toBeOnTheScreen()
    expect(screen.getByText('The best rock artists')).toBeOnTheScreen()
    expect(screen.getByText('Queen')).toBeOnTheScreen()
    expect(screen.getByText('Led Zeppelin')).toBeOnTheScreen()
  })

  it('should trigger ConsultArtist log when artist item pressed', async () => {
    renderVerticalPlaylistArtists()

    await user.press(await screen.findByText('Queen'))

    expect(analytics.logConsultArtist).toHaveBeenCalledWith({
      artistId: '1',
      artistName: 'Queen',
      from: 'verticalplaylistartists',
      originDetails: 'offer',
    })
  })
})

const renderVerticalPlaylistArtists = () =>
  render(reactQueryProviderHOC(<VerticalPlaylistArtists />))
