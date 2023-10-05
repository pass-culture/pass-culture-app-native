import { SubscriptionStatus, YoungStatusType } from 'api/gen'
import { getEligibleBookingButtonProps } from 'features/favorites/helpers/getEligibleBookingButtonProps'
import { OfferModal } from 'shared/offer/enums'

describe('getEligibleBookingButtonProps', () => {
  it.each`
    subscriptionStatus                                 | expectedModal                        | expectedModalName
    ${SubscriptionStatus.has_to_complete_subscription} | ${OfferModal.FINISH_SUBSCRIPTION}    | ${'FINISH_SUBSCRIPTION'}
    ${SubscriptionStatus.has_subscription_pending}     | ${OfferModal.APPLICATION_PROCESSING} | ${'APPLICATION_PROCESSING'}
    ${SubscriptionStatus.has_subscription_issues}      | ${OfferModal.ERROR_APPLICATION}      | ${'ERROR_APPLICATION'}
  `(
    'should return $expectedModalName modal and title "Réserver" when user as subscription status $subscriptionStatus',
    ({ subscriptionStatus, expectedModal }) => {
      const buttonProps = getEligibleBookingButtonProps(
        {
          statusType: YoungStatusType.eligible,
          subscriptionStatus,
        },
        1234
      )

      expect(buttonProps?.wording).toBe('Réserver')
      expect(buttonProps?.disabled).toBe(false)
      expect(buttonProps?.onPress).toBeInstanceOf(Function)
      expect(buttonProps?.modalToDisplay).toBe(expectedModal)
    }
  )
})
