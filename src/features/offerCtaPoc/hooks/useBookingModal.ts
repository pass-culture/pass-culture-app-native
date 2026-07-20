import { offerCtaActions, useIsBookingModalVisible } from 'features/offerCtaPoc/store/offerCtaStore'

// VARIANT B — single-responsibility use-case hook: "the booking modal".
export const useBookingModal = (): {
  isVisible: boolean
  open: () => void
  close: () => void
} => ({
  isVisible: useIsBookingModalVisible(),
  open: offerCtaActions.openBookingModal,
  close: offerCtaActions.closeBookingModal,
})
