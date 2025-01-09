import { ModalKey, ModalState, modalManager, modalsOptions } from './modalManager.store'

/**
 * Closes the currently displayed modal and displays the next stacked modal if any
 */
export const closeModal = () => {
  const currentModal = findModalByState(ModalState.DISPLAYED)

  if (currentModal) {
    modalManager.actions.close(currentModal)
    displayNextStackedModal()
  }
}

/**
 * Opens a new modal or stacks it if another modal is already displayed
 */
export const openModal = (modalKey: ModalKey) => {
  const currentModal = findModalByState(ModalState.DISPLAYED)
  const shouldStackModal = currentModal && getIsStackableModal(modalKey)

  if (shouldStackModal) {
    modalManager.actions.stack(modalKey)
    return
  }

  if (!currentModal) {
    modalManager.actions.open(modalKey)
  }
}

const findModalByState = (state: ModalState) => {
  const modalStates = modalManager.useStore.getState()
  return Object.keys(modalStates).find((key) => modalStates[key as ModalKey] === state) as ModalKey
}

const getIsStackableModal = (modalKey: ModalKey) => !!modalsOptions[modalKey].isStackable

const displayNextStackedModal = () => {
  const nextModal = findModalByState(ModalState.STACKED)
  if (nextModal) {
    modalManager.actions.open(nextModal)
  }
}
