import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { useShareOffer } from 'features/offer/helpers/useShareOffer'
import { useAvailableCredit } from 'features/user/helpers/useAvailableCredit'
import { analytics } from 'libs/firebase/analytics'
import { useShowReview } from 'libs/hooks/useShowReview'
import { formatToFrenchDecimal } from 'libs/parsers'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { WebShareModal } from 'libs/share/WebShareModal'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { useModal } from 'ui/components/modals/useModal'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BicolorTicketBooked } from 'ui/svg/icons/BicolorTicketBooked'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export function BookingConfirmation() {
  const { params } = useRoute<UseRouteType<'BookingConfirmation'>>()
  const { share: shareOffer, shareContent } = useShareOffer(params.offerId)
  const { reset } = useNavigation<UseNavigationType>()
  const credit = useAvailableCredit()
  const amountLeft = credit && !credit.isExpired ? credit.amount : 0

  const trackBooking = useCallback(() => BatchUser.trackEvent(BatchEvent.hasBooked), [])

  const displayBookingDetails = useCallback(() => {
    analytics.logSeeMyBooking(params.offerId)
    trackBooking()
    reset({
      index: 1,
      routes: [
        {
          name: 'TabNavigator',
          state: {
            routes: [{ name: 'Bookings' }],
            index: 0,
          },
        },
        {
          name: 'BookingDetails',
          params: {
            id: params.bookingId,
          },
        },
      ],
    })
  }, [params.bookingId, params.offerId, reset, trackBooking])

  const {
    visible: shareOfferModalVisible,
    showModal: showShareOfferModal,
    hideModal: hideShareOfferModal,
  } = useModal(false)

  const pressShareOffer = useCallback(() => {
    shareOffer()
    showShareOfferModal()
  }, [shareOffer, showShareOfferModal])

  useShowReview()

  const amountLeftText = `Il te reste encore ${formatToFrenchDecimal(
    amountLeft
  )} à dépenser sur le pass Culture.`

  return (
    <React.Fragment>
      <GenericInfoPageWhite
        title="Réservation confirmée&nbsp;!"
        titleComponent={Typo.Title2}
        icon={BicolorTicketBooked}
        separateIconFromTitle={false}
        mobileBottomFlex={0.1}>
        <StyledBody>{amountLeftText}</StyledBody>
        <StyledBody>
          Tu peux retrouver toutes les informations concernant ta réservation sur l’application
        </StyledBody>
        <Spacer.Flex />
        <ButtonContainer>
          <ButtonPrimary key={1} wording="Voir ma réservation" onPress={displayBookingDetails} />
          <Spacer.Column numberOfSpaces={4} />
          <ButtonSecondary wording="Partager l’offre" onPress={pressShareOffer} />
          <Spacer.Column numberOfSpaces={4} />
          <InternalTouchableLink
            key={2}
            as={ButtonSecondary}
            wording="Retourner à l'accueil"
            navigateTo={navigateToHomeConfig}
            onBeforeNavigate={trackBooking}
            icon={PlainArrowPrevious}
          />
        </ButtonContainer>
      </GenericInfoPageWhite>
      {!!shareContent && (
        <WebShareModal
          visible={shareOfferModalVisible}
          headerTitle="Partager l’offre"
          shareContent={shareContent}
          dismissModal={hideShareOfferModal}
        />
      )}
    </React.Fragment>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const ButtonContainer = styled.View({
  paddingBottom: getSpacing(10),
})
