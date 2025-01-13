import { createActions } from 'libs/store/createActions'
import { createConfiguredStore } from 'libs/store/createConfiguredStore'

interface Name {
  firstName: string
  lastName: string
}

type State = { name: Name | null }

const defaultState: State = { name: null }

const useNameStore = createConfiguredStore({
  name: 'profile-name',
  defaultState,
  options: { persist: true },
})

export const useName = () => useNameStore((state) => state.name)

export const nameActions = createActions(useNameStore, (set) => ({
  setName: (name: Name) => set({ name }),
  resetName: () => set(defaultState),
}))
