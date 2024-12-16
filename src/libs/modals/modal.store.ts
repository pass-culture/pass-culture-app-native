import { createStore } from 'libs/store/createStore'

export type Modal<P> = {
  key: string
  params: P
}

type State = {
  modalOpened?: Modal<unknown>
  queue: Modal<unknown>[]
}

const defaultStore: State = {
  modalOpened: undefined,
  queue: [],
}

const setActions = (set: (payload: (state: State) => State) => void) => ({
  openModal: (modal: Modal<unknown>) => {
    set((state) => ({
      ...state,
      modalOpened: modal,
    }))
  },
  queueModal: (modal: Modal<unknown>) => {
    set((state) => ({
      ...state,
      queue: [...state.queue, modal],
    }))
  },
  clearOpenedModal: () => {
    set((state) => ({
      ...state,
      modalOpened: undefined,
    }))
  },
  removeModalFromQueue: (modal: Modal<unknown>) => {
    set((state) => ({
      ...state,
      queue: state.queue.filter((queuedModal) => queuedModal !== modal),
    }))
  },
})

export const modalStore = createStore<State, ReturnType<typeof setActions>>(
  'modals',
  defaultStore,
  setActions
)
