import { Modal, modalStore } from '../modal.store'

export const openModal = (modal: Modal<unknown>) => {
  const {
    modalOpened,
    actions: { openModal, queueModal },
  } = modalStore.getState()
  const hasModalOpened = modalOpened !== undefined

  if (hasModalOpened) {
    queueModal(modal)
    return
  }

  openModal(modal)
}
