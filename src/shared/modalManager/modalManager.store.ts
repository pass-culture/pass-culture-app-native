import { createSlice } from 'libs/store/createSlice'

import { openModal, closeModal } from './modalManager.handlers'

export type ModalKey = 'REACTION' | 'ACHIEVEMENT' | 'STACKABLE'

export const modalsOptions: Record<ModalKey, ModalsOptions> = {
  REACTION: {},
  ACHIEVEMENT: {},
  STACKABLE: { isStackable: true },
}

type ModalsOptions = {
  isStackable?: boolean
}

export enum ModalState {
  DISPLAYED,
  STACKED,
  NONE,
}

type Store = Record<ModalKey, ModalState>

const defaultState = Object.keys(modalsOptions).reduce(
  (state, currentKey) => ({ ...state, [currentKey]: ModalState.NONE }),
  {} as Store
)

export const modalManager = createSlice({
  name: 'modal-manager',
  defaultState,
  actions: (setState) => ({
    open: (modalKey: ModalKey) => {
      setState({ [modalKey]: ModalState.DISPLAYED })
    },
    close: (modalKey: ModalKey) => {
      setState({ [modalKey]: ModalState.NONE })
    },
    stack: (modalKey: ModalKey) => {
      setState({ [modalKey]: ModalState.STACKED })
    },
  }),
  selectors: {
    selectDisplayedModal: () => (state) =>
      Object.keys(state).find(
        (modalKey) => state[modalKey as ModalKey] === ModalState.DISPLAYED
      ) as ModalKey,
    selectIsDisplayed: (modalKey: ModalKey) => (state) => {
      return state[modalKey] === ModalState.DISPLAYED
    },
  },
  handlers: { openModal, closeModal },
})
