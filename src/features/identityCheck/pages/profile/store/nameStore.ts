import { createStore } from 'libs/store/createStore'

interface Name {
  firstName: string
  lastName: string
}

type State = { name: Name | null }

type Actions = {
  setName: (payload: Name) => void
  resetName: () => void
}

const useNameStore = createStore<State, Actions>(
  'profile-name',
  { name: null },
  (set) => ({
    setName: (payload) => set({ name: payload }),
    resetName: () => set({ name: null }),
  }),
  { persist: true }
)

export const useName = () => useNameStore((state) => state.name)
export const useNameActions = () => useNameStore((state) => state.actions)
