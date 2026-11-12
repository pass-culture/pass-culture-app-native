import {
  homePlaylistsActions,
  homePlaylistsSelectors,
} from 'features/home/store/homePlaylists.store'

describe('homePlaylists store', () => {
  it('should not count hidden playlists in the rank of the next ones', () => {
    homePlaylistsActions.setIsDisplayed('home1', 2, false)
    homePlaylistsActions.setIsDisplayed('home1', 3, true)
    homePlaylistsActions.setIsDisplayed('home1', 9, true)

    expect(homePlaylistsSelectors.selectRank('home1', 3)).toBe(0)
    expect(homePlaylistsSelectors.selectRank('home1', 9)).toBe(1)
  })

  it('should update the ranks when a playlist stops being displayed', () => {
    homePlaylistsActions.setIsDisplayed('home2', 3, true)
    homePlaylistsActions.setIsDisplayed('home2', 4, true)

    homePlaylistsActions.setIsDisplayed('home2', 3, false)

    expect(homePlaylistsSelectors.selectRank('home2', 4)).toBe(0)
  })
})
