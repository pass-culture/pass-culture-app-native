import { createStore } from 'libs/store/createStore'

interface Name {
  firstName: string
  lastName: string
}

type State = { name: Name | null }

const defaultState: State = { name: null }

const setActions = (set: (payload: State) => void) => ({
  setName: (payload: Name) => set({ name: payload }),
  resetName: () => set(defaultState),
})

const useNameStore = createStore<State, ReturnType<typeof setActions>>(
  'profile-name',
  defaultState,
  setActions,
  { persist: true }
)

export const useName = () => useNameStore((state) => state.name)
export const useNameActions = () => useNameStore((state) => state.actions)
