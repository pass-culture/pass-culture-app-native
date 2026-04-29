import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'

import { EligibilityType } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { UseNavigationType, UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { getShareOffer } from 'features/share/helpers/getShareOffer'
import { WebShareModal } from 'features/share/pages/WebShareModal'
import { analytics } from 'libs/analytics/provider'
import { useShowReview } from 'libs/hooks/useShowReview'
import { BatchEvent, BatchProfile } from 'libs/react-native-batch'
import { useOfferQuery } from 'queries/offer/useOfferQuery'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useAvailableCredit } from 'shared/user/useAvailableCredit'
import { useModal } from 'ui/components/modals/useModal'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { TicketBooked } from 'ui/svg/icons/TicketBooked'
import { LINE_BREAK } from 'ui/theme/constants'

export function BookingConfirmation() {
  const { params } = useRoute<UseRouteType<'BookingConfirmation'>>()
  const { user } = useAuthContext()
  const { data: offer } = useOfferQuery({ offerId: params.offerId })
  const { share: shareOffer, shareContent } = getShareOffer({
    offer,
    utmMedium: 'post_booking',
  })
  const { reset } = useNavigation<UseNavigationType>()
  const credit = useAvailableCredit()
  const amountLeft = credit && !credit.isExpired ? credit.amount : 0

  const trackBooking = useCallback(() => BatchProfile.trackEvent(BatchEvent.hasBooked), [])

  const displayBookingDetails = useCallback(() => {
    analytics.logSeeMyBooking(params.offerId)
    analytics.logViewedBookingPage({ offerId: params.offerId, from: 'bookingconfirmation' })
    trackBooking()
    reset({
      index: 1,
      routes: [
        { name: 'TabNavigator', state: { routes: [{ name: 'Bookings' }], index: 0 } },
        { name: 'BookingDetails', params: { id: params.bookingId } },
      ],
    })
  }, [params.bookingId, params.offerId, reset, trackBooking])

  const {
    visible: shareOfferModalVisible,
    showModal: showShareOfferModal,
    hideModal: hideShareOfferModal,
  } = useModal(false)

  const pressShareOffer = useCallback(() => {
    analytics.logShare({ type: 'Offer', from: 'bookingconfirmation', offerId: params.offerId })
    shareOffer()
    showShareOfferModal()
  }, [params.offerId, shareOffer, showShareOfferModal])

  useShowReview()

  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()
  const amountLeftWithCurrency = formatCurrencyFromCents(
    amountLeft,
    currency,
    euroToPacificFrancRate
  )

  const isUserFreeStatus = user?.eligibility === EligibilityType.free
  const amountLeftText = isUserFreeStatus
    ? ''
    : `Il te reste encore ${amountLeftWithCurrency} à dépenser sur le pass Culture.${LINE_BREAK}`

  return (
    <React.Fragment>
      <GenericInfoPage
        illustration={TicketBooked}
        title="Réservation confirmée&nbsp;!"
        subtitle={`${amountLeftText}Tu peux retrouver toutes les informations concernant ta réservation sur l’application.`}
        buttonPrimary={{
          wording: 'Voir ma réservation',
          onPress: displayBookingDetails,
        }}
        buttonSecondary={{
          wording: 'Partager l’offre',
          onPress: pressShareOffer,
        }}
        buttonTertiary={{
          wording: 'Retourner à l’accueil',
          navigateTo: navigateToHomeConfig,
          onBeforeNavigate: trackBooking,
          icon: PlainArrowPrevious,
        }}
      />
      {shareContent ? (
        <WebShareModal
          visible={shareOfferModalVisible}
          headerTitle="Partager l’offre"
          shareContent={shareContent}
          dismissModal={hideShareOfferModal}
        />
      ) : null}
    </React.Fragment>
  )
}
