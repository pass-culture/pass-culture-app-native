import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { getShareOffer } from 'features/share/helpers/getShareOffer'
import { WebShareModal } from 'features/share/pages/WebShareModal'
import { analytics } from 'libs/analytics/provider'
import { useShowReview } from 'libs/hooks/useShowReview'
import { BatchEvent, BatchProfile } from 'libs/react-native-batch'
import { useOfferQuery } from 'queries/offer/useOfferQuery'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { useAvailableCredit } from 'shared/user/useAvailableCredit'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { ButtonTertiaryPrimary } from 'ui/components/buttons/ButtonTertiaryPrimary'
import { useModal } from 'ui/components/modals/useModal'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BicolorTicketBooked } from 'ui/svg/icons/BicolorTicketBooked'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'

export function BookingConfirmation() {
  const { params } = useRoute<UseRouteType<'BookingConfirmation'>>()
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
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const amountLeftWithCurrency = formatCurrencyFromCents(
    amountLeft,
    currency,
    euroToPacificFrancRate
  )
  const amountLeftText = `Il te reste encore ${amountLeftWithCurrency} à dépenser sur le pass Culture.`

  return (
    <React.Fragment>
      <GenericInfoPageWhite
        title="Réservation confirmée&nbsp;!"
        titleComponent={TypoDS.Title2}
        icon={BicolorTicketBooked}
        separateIconFromTitle={false}
        mobileBottomFlex={0.1}>
        <StyledBody>{amountLeftText}</StyledBody>
        <StyledBody>
          Tu peux retrouver toutes les informations concernant ta réservation sur l’application.
        </StyledBody>
        <Spacer.Flex />
        <ButtonContainer>
          <ButtonPrimary key={1} wording="Voir ma réservation" onPress={displayBookingDetails} />
          <ButtonSecondary wording="Partager l’offre" onPress={pressShareOffer} />
          <InternalTouchableLink
            key={2}
            as={ButtonTertiaryPrimary}
            wording="Retourner à l’accueil"
            navigateTo={navigateToHomeConfig}
            onBeforeNavigate={trackBooking}
            icon={PlainArrowPrevious}
          />
        </ButtonContainer>
      </GenericInfoPageWhite>
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

const StyledBody = styled(TypoDS.Body)({
  textAlign: 'center',
})

const ButtonContainer = styled.View({
  paddingBottom: getSpacing(10),
  gap: getSpacing(4),
})
