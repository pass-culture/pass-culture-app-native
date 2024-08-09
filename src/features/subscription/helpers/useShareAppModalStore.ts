import { createStore } from 'libs/store/createStore'

type State = {
  hasSeenShareAppModal: boolean
}
const setActions = (set: (payload: State) => void) => ({
  seeShareAppModal: () => set({ hasSeenShareAppModal: true }),
})

export const useShareAppModalStore = createStore(
  'shareAppModal',
  { hasSeenShareAppModal: false },
  setActions,
  { persist: true }
)
