import { Scenario } from 'features/offerCtaPoc/fixtures/scenarios'
import { resolveOfferCta } from 'features/offerCtaPoc/helpers/resolveOfferCta'
import { useOfferCtaDataQuery } from 'features/offerCtaPoc/queries/useOfferCtaDataQuery'
import { offerCtaActions, useIsBookingModalVisible } from 'features/offerCtaPoc/store/offerCtaStore'
import { CtaDecision } from 'features/offerCtaPoc/types'

// VARIANT A — one orchestration hook produces a render-ready ViewModel.
// Boundaries used: React Query (server) + Zustand (local) + pure core.

export type OfferCtaViewModel = {
  isLoading: boolean
  decision?: CtaDecision
  isBookingModalVisible: boolean
  onPress: () => void
  onCloseBookingModal: () => void
}

export const useOfferCtaViewModel = (scenario: Scenario): OfferCtaViewModel => {
  const { data, isLoading } = useOfferCtaDataQuery(scenario)
  const isBookingModalVisible = useIsBookingModalVisible()

  const decision = data ? resolveOfferCta(data) : undefined

  const onPress = () => {
    if (!decision || decision.isDisabled) return
    // Booking & auth open the same modal in this slice.
    offerCtaActions.openBookingModal()
  }

  return {
    isLoading,
    decision,
    isBookingModalVisible,
    onPress,
    onCloseBookingModal: offerCtaActions.closeBookingModal,
  }
}
