import { ActivityIdEnum } from 'api/gen'
import { createStore } from 'libs/store/createStore'

type State = {
  status: ActivityIdEnum | null
}

const defaultState: State = { status: null }

const statusStore = createStore({
  name: 'profile-status',
  defaultState,
  actions: (set) => ({
    setStatus: (status: ActivityIdEnum) => set({ status }),
    resetStatus: () => set(defaultState),
  }),
  selectors: {
    selectStatus: () => (state) => state.status,
  },
  options: { persist: true },
})

export const statusActions = statusStore.actions

export const { useStatus } = statusStore.hooks
