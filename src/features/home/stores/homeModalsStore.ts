import { createStore } from 'libs/store/createStore'

enum Modals {
  REACTION,
  ACHIEVEMENT,
}

export enum ModalDisplayState {
  PENDING = 'pending',
  SHOULD_SHOW = 'shouldShow',
  SHOULD_NOT_SHOW = 'shouldNotShow',
}

type State = {
  modalToShow: Modals | null
  modalsState: Record<Modals, ModalDisplayState>
}

const defaultState: State = {
  modalToShow: null,
  modalsState: {
    [Modals.ACHIEVEMENT]: ModalDisplayState.SHOULD_NOT_SHOW,
    [Modals.REACTION]: ModalDisplayState.SHOULD_NOT_SHOW,
  },
}

export const homeModalsStore = createStore({
  name: 'home-modals',
  defaultState,
  actions: (set) => ({
    setModalState: (modal: Modals, modalState: ModalDisplayState) => {
      set((state) => ({ modalsState: { ...state.modalsState, [modal]: modalState } }))
    },
  }),
})

homeModalsStore.actions.setModalState(Modals.ACHIEVEMENT, ModalDisplayState.SHOULD_NOT_SHOW)
