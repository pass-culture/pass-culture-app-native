import { SubscriptionStatus, YoungStatusResponse } from 'api/gen'
import { analytics } from 'libs/analytics'
import { OfferModal } from 'shared/offer/enums'

const subscriptionTracker = {
  [SubscriptionStatus.has_to_complete_subscription]: analytics.logConsultFinishSubscriptionModal,
  [SubscriptionStatus.has_subscription_pending]: analytics.logConsultApplicationProcessingModal,
  [SubscriptionStatus.has_subscription_issues]: analytics.logConsultErrorApplicationModal,
}

export const getEligibleBookingButtonProps = (userStatus: YoungStatusResponse, offerId: number) => {
  const common = {
    wording: 'Réserver',
    disabled: false,
  }
  if (userStatus.subscriptionStatus === SubscriptionStatus.has_to_complete_subscription) {
    return {
      onPress: () => subscriptionTracker[SubscriptionStatus.has_to_complete_subscription](offerId),
      ...common,
      modalToDisplay: OfferModal.FINISH_SUBSCRIPTION,
    }
  }
  if (userStatus.subscriptionStatus === SubscriptionStatus.has_subscription_pending) {
    return {
      onPress: () => subscriptionTracker[SubscriptionStatus.has_subscription_pending](offerId),
      ...common,
      modalToDisplay: OfferModal.APPLICATION_PROCESSING,
    }
  }
  if (userStatus.subscriptionStatus === SubscriptionStatus.has_subscription_issues) {
    return {
      onPress: () => subscriptionTracker[SubscriptionStatus.has_subscription_issues](offerId),
      ...common,
      modalToDisplay: OfferModal.ERROR_APPLICATION,
    }
  }

  return
}
