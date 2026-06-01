import { Scenario } from 'features/offerCtaPoc/fixtures/scenarios'
import { useBookingModal } from 'features/offerCtaPoc/hooks/useBookingModal'
import { useCtaDecision } from 'features/offerCtaPoc/hooks/useCtaDecision'
import { OfferCtaViewModel } from 'features/offerCtaPoc/hooks/useOfferCtaViewModel'

// VARIANT C (hybrid) — the ViewModel is COMPOSED from the small use-case hooks
// of variant B (`useCtaDecision`, `useBookingModal`), and exposes the same
// `OfferCtaViewModel` as variant A so it can feed the very same pure View.
//
// → B's granularity (small testable units) + A's humble-object boundary.
// The glue (which action on press) lives HERE, in a hook, never in the JSX.
export const useOfferCtaViewModelComposed = (scenario: Scenario): OfferCtaViewModel => {
  const { isLoading, decision } = useCtaDecision(scenario)
  const bookingModal = useBookingModal()

  const onPress = () => {
    if (!decision || decision.isDisabled) return
    // On the real CTA this would switch on `decision.type` to pick the right
    // action (booking / auth / subscription…). The point: the decision lives
    // in a hook, not in the component.
    bookingModal.open()
  }

  return {
    isLoading,
    decision,
    isBookingModalVisible: bookingModal.isVisible,
    onPress,
    onCloseBookingModal: bookingModal.close,
  }
}
