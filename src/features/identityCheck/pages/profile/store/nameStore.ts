import { createActions } from 'libs/store/createActions'
import { createStore } from 'libs/store/createStore'

interface Name {
  firstName: string
  lastName: string
}

type State = { name: Name | null }

const defaultState: State = { name: null }

const useNameStore = createStore({ name: 'profile-name', defaultState, options: { persist: true } })

export const useName = () => useNameStore((state) => state.name)

export const nameActions = createActions(useNameStore, (set) => ({
  setName: (name: Name) => set({ name }),
  resetName: () => set(defaultState),
}))
