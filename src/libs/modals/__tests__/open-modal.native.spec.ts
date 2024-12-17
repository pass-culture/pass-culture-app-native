import { modalStore } from '../modal.store'

describe('Feature: Open modal', () => {
  test('Modal is opened', () => {
    modalStore.getState().actions.openModal({ key: 'modal-key', params: { text: 'Hello world!' } })

    expect(modalStore.getState().modalOpened).toEqual({
      key: 'modal-key',
      params: { text: 'Hello world!' },
    })
  })

  test('Modal is queued if another modal is opened', () => {
    modalStore.setState({
      modalOpened: { key: 'modal-key-1', params: { text: 'Hello world!' } },
    })

    modalStore
      .getState()
      .actions.openModal({ key: 'modal-key-1', params: { text: 'Hello world!' } })

    expect(modalStore.getState().queue).toEqual([
      {
        key: 'modal-key-1',
        params: { text: 'Hello world!' },
      },
    ])
  })
})
