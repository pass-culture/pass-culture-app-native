import { GridListLayout } from 'features/search/types'
import { createStore } from 'libs/store/createStore'

type State = {
  layout: GridListLayout
}

const defaultState: State = { layout: GridListLayout.LIST }

const gridListLayoutStore = createStore({
  name: 'grid-list-layout',
  defaultState,
  actions: (set) => ({
    setLayout: (layout: GridListLayout) => set({ layout }),
    resetLayout: () => set(defaultState),
  }),
  selectors: {
    selectGridListLayout: () => (state) => state.layout,
  },
  options: { persist: true },
})

export const gridListLayoutActions = gridListLayoutStore.actions
export const { useGridListLayout } = gridListLayoutStore.hooks
