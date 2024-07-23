import { useShareAppModaleTrigger } from './useShareAppModaleTrigger'

describe('Share app modale trigger', () => {
  describe('Variant first_session_after_reservation', () => {
    test('Modal is shown when first session after last booking was consumed', () => {
      let modalIsOpen = false
      const openModal = () => {
        modalIsOpen = true
      }
      useShareAppModaleTrigger('first_session_after_reservation', {
        lastBookingConsumed: true,
        openModal,
      })

      expect(modalIsOpen).toBe(true)
    })

    test('Modal is NOT shown when last booking was NOT consumed', () => {
      let modalIsOpen = false
      const openModal = () => {
        modalIsOpen = true
      }
      useShareAppModaleTrigger('first_session_after_reservation', {
        lastBookingConsumed: false,
        openModal,
      })

      expect(modalIsOpen).toBe(false)
    })
  })

  describe('Variant two_weeks_after_credit', () => {
    test('Modal is shown when credit was received two weeks ago', () => {
      let modalIsOpen = false
      const openModal = () => {
        modalIsOpen = true
      }
      useShareAppModaleTrigger('first_session_after_reservation', {
        lastBookingConsumed: true,
        openModal,
      })

      expect(modalIsOpen).toBe(true)
    })

    test('Modal is NOT shown when last booking was NOT consumed', () => {
      let modalIsOpen = false
      const openModal = () => {
        modalIsOpen = true
      }
      useShareAppModaleTrigger('first_session_after_reservation', {
        lastBookingConsumed: false,
        openModal,
      })

      expect(modalIsOpen).toBe(false)
    })
  })
})
