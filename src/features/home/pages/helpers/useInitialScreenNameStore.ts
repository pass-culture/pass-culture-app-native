import { createStore } from 'libs/store/createStore'

type InitialScreenName = {
  initialScreenName: string | undefined
}

const defaultState: InitialScreenName = {
  initialScreenName: undefined,
}

const initialScreenNameStore = createStore({
  name: 'initialScreenName',
  defaultState,
  options: { persist: false },
  actions: (set) => ({
    setInitialScreenName: (initialScreenName: string) => set({ initialScreenName }),
  }),
  selectors: {
    selectInitialScreenName: () => (state) => state.initialScreenName,
  },
})

export const initialScreenNameActions = initialScreenNameStore.actions
export const { useInitialScreenName } = initialScreenNameStore.hooks
