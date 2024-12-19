import { modalStore } from '../modal.store'

describe('Feature: Close modal', () => {
  test('Modal is closed', () => {
    const modal = { key: 'modal-key', params: { text: 'Hello world!' } }
    modalStore.setState({ modalOpened: modal })

    modalStore.getState().actions.closeModal()

    expect(modalStore.getState().modalOpened).toBeUndefined()
  })

  test('Modal is opened from queue if there is one', () => {
    const modal = { key: 'modal-key', params: { text: 'Hello world!' } }
    const queuedModal = { key: 'queued-modal-key', params: { text: 'Hello world!' } }
    modalStore.setState({ modalOpened: modal, queue: [queuedModal] })

    modalStore.getState().actions.closeModal()

    expect(modalStore.getState().modalOpened).toEqual(queuedModal)
  })
})
