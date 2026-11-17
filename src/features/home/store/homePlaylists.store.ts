import { createStore } from 'libs/store/createStore'

// Whether each playlist is displayed, by home entry id then by position in the home
type State = Record<string, Record<number, boolean>>

const homePlaylistsStore = createStore({
  name: 'home-playlists',
  defaultState: {} as State,
  actions: (set) => ({
    setIsDisplayed: (homeEntryId: string, position: number, isDisplayed: boolean) =>
      set((state) => ({ [homeEntryId]: { ...state[homeEntryId], [position]: isDisplayed } })),
  }),
  selectors: {
    // Rank of a playlist among the displayed ones (0 for the first), unlike its position in the home
    selectRank: (homeEntryId: string | undefined, position: number) => (state: State) =>
      Object.entries((homeEntryId && state[homeEntryId]) || {}).filter(
        ([key, isDisplayed]) => isDisplayed && Number(key) < position
      ).length,
  },
})

export const homePlaylistsActions = homePlaylistsStore.actions
export const homePlaylistsSelectors = homePlaylistsStore.selectors
export const useHomePlaylistRank = homePlaylistsStore.hooks.useRank
