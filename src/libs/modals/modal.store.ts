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
    set((state) => {
      const hasModalOpened = state.modalOpened !== undefined

      return {
        ...state,
        modalOpened: modal,
        queue: hasModalOpened ? [...state.queue, modal] : state.queue,
      }
    })
  },
  closeModal: () => {
    set((state) => {
      const [nextModal] = state.queue

      return {
        ...state,
        modalOpened: nextModal,
        queue: state.queue.filter((queuedModal) => queuedModal !== nextModal),
      }
    })
  },
})

export const modalStore = createStore<State, ReturnType<typeof setActions>>(
  'modals',
  defaultStore,
  setActions
)

export const useModalStore = modalStore
export const useModalActions = () => modalStore((state) => state.actions)
