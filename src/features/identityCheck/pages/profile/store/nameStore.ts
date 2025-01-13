import { createStore } from 'libs/store/createStore'

interface Name {
  firstName: string
  lastName: string
}

type State = { name: Name | null }

const defaultState: State = { name: null }

const nameStore = createStore({
  name: 'profile-name',
  defaultState,
  actions: (set) => ({
    setName: (name: Name) => set({ name }),
    resetName: () => set(defaultState),
  }),
  options: { persist: true },
})

export const nameActions = nameStore.actions
export const useName = () => nameStore.useStore((state) => state.name)
