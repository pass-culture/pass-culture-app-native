import { createActions } from 'libs/store/createActions'
import { createStore } from 'libs/store/createStore'

interface Name {
  firstName: string
  lastName: string
}

type State = { name: Name | null }

const defaultState: State = { name: null }

const useNameStore = createStore('profile-name', defaultState, { persist: true })

export const useName = () => useNameStore((state) => state.name)

export const nameActions = createActions(useNameStore, (set) => ({
  setName: (payload: Name) => set({ name: payload }),
  resetName: () => set(defaultState),
}))
