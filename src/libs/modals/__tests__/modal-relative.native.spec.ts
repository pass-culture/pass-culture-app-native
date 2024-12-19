import { createModal, createRelativeModals } from '../modal.creator'

describe('Feature: Modal relative', () => {
  test('Modal is returned', () => {
    const firstModal = createModal<{ title: string }>('first')
    const relativeModal = createRelativeModals({
      creator: firstModal,
      check() {
        return firstModal({ title: 'hello world' })
      },
    })

    expect(relativeModal).toEqual(firstModal({ title: 'hello world' }))
  })

  test('Second modal is returned when first modal has not to be open', () => {
    const firstModal = createModal<{ title: string }>('first')
    const secondModal = createModal<{ name: string }>('second')
    const relativeModal = createRelativeModals(
      {
        creator: firstModal,
        check() {
          return undefined
        },
      },
      {
        creator: secondModal,
        check() {
          return secondModal({ name: 'hello world' })
        },
      }
    )

    expect(relativeModal).toEqual(secondModal({ name: 'hello world' }))
  })

  test('Return the first modal to be open', () => {
    const firstModal = createModal<{ title: string }>('first')
    const secondModal = createModal<{ name: string }>('second')
    const relativeModal = createRelativeModals(
      {
        creator: firstModal,
        check() {
          return firstModal({ title: 'hello world' })
        },
      },
      {
        creator: secondModal,
        check() {
          return secondModal({ name: 'hello world' })
        },
      }
    )

    expect(relativeModal).toEqual(firstModal({ title: 'hello world' }))
  })

  test('Return undefined when no modal has to be open', () => {
    const firstModal = createModal<{ title: string }>('first')
    const secondModal = createModal<{ name: string }>('second')
    const relativeModal = createRelativeModals(
      {
        creator: firstModal,
        check() {
          return undefined
        },
      },
      {
        creator: secondModal,
        check() {
          return undefined
        },
      }
    )

    expect(relativeModal).toBeUndefined()
  })
})
