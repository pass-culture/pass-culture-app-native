import { t } from '@lingui/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { useAvailableCredit } from 'features/home/services/useAvailableCredit'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { useShowReview } from 'libs/hooks/useShowReview'
import { formatToFrenchDecimal } from 'libs/parsers'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { TicketBooked } from 'ui/svg/icons/TicketBooked'
import { Spacer, Typo } from 'ui/theme'

export function BookingConfirmation() {
  const { params } = useRoute<UseRouteType<'BookingConfirmation'>>()
  const { reset } = useNavigation<UseNavigationType>()
  const credit = useAvailableCredit()
  const amountLeft = credit && !credit.isExpired ? credit.amount : 0

  const displayBookingDetails = () => {
    analytics.logSeeMyBooking(params.offerId)
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

  return (
    <GenericInfoPage
      title={t`Réservation confirmée\u00a0!`}
      icon={TicketBooked}
      buttons={[
        <ButtonPrimaryWhite
          key={1}
          wording={t`Voir ma réservation`}
          onPress={displayBookingDetails}
        />,
        <ButtonTertiaryWhite key={2} wording={t`Retourner à l'accueil`} onPress={navigateToHome} />,
      ]}>
      <StyledBody>
        {t({
          id: 'credit left to spend',
          values: { credit: formatToFrenchDecimal(amountLeft) },
          message: 'Il te reste encore {credit} à dépenser sur le pass\u00a0!',
        })}
      </StyledBody>
      <Spacer.Column numberOfSpaces={4} />
      <StyledBody>
        {t`Tu peux retrouver toutes les informations concernant ta réservation sur l’application`}
      </StyledBody>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.white,
}))
