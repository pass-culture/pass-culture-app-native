import { modalStore } from '../modal.store'

import { openModal } from './open-modal'
export const closeModal = () => {
  const {
    queue,
    actions: { clearOpenedModal, removeModalFromQueue },
  } = modalStore.getState()

  clearOpenedModal()
  const [nextModal] = queue

  if (nextModal) {
    removeModalFromQueue(nextModal)
    openModal(nextModal)
  }
}
