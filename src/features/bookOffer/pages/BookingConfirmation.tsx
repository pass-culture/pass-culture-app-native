import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { useAvailableCredit } from 'features/home/services/useAvailableCredit'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/firebase/analytics'
import { useShowReview } from 'libs/hooks/useShowReview'
import { formatToFrenchDecimal } from 'libs/parsers'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { TicketBooked } from 'ui/svg/icons/TicketBooked'
import { Spacer, Typo } from 'ui/theme'

export function BookingConfirmation() {
  const { params } = useRoute<UseRouteType<'BookingConfirmation'>>()
  const { reset } = useNavigation<UseNavigationType>()
  const credit = useAvailableCredit()
  const amountLeft = credit && !credit.isExpired ? credit.amount : 0

  const trackBooking = useCallback(() => BatchUser.trackEvent(BatchEvent.hasBooked), [])

  const displayBookingDetails = () => {
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
  }

  useShowReview()

  const amountLeftText = `Il te reste encore ${formatToFrenchDecimal(
    amountLeft
  )} à dépenser sur le pass\u00a0!`

  return (
    <GenericInfoPage
      title="Réservation confirmée&nbsp;!"
      icon={TicketBooked}
      buttons={[
        <ButtonPrimaryWhite
          key={1}
          wording="Voir ma réservation"
          onPress={displayBookingDetails}
        />,
        <TouchableLink
          key={2}
          as={ButtonTertiaryWhite}
          wording="Retourner à l'accueil"
          navigateTo={navigateToHomeConfig}
          onPress={trackBooking}
        />,
      ]}>
      <StyledBody>{amountLeftText}</StyledBody>
      <Spacer.Column numberOfSpaces={4} />
      <StyledBody>
        Tu peux retrouver toutes les informations concernant ta réservation sur l’application
      </StyledBody>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.white,
}))
