import { t } from '@lingui/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { useAvailableCredit } from 'features/home/services/useAvailableCredit'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { formatToFrenchDecimal } from 'libs/parsers'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { TicketBooked } from 'ui/svg/icons/TicketBooked'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

export function BookingConfirmation() {
  const { params } = useRoute<UseRouteType<'BookingConfirmation'>>()

  const { navigate } = useNavigation<UseNavigationType>()
  const credit = useAvailableCredit()

  const amountLeft = credit && !credit.isExpired ? credit.amount : 0

  return (
    <GenericInfoPage
      title={t`Réservation confirmée !`}
      icon={TicketBooked}
      iconSize={getSpacing(65)}>
      <StyledBody>
        {t`Il te reste encore ${formatToFrenchDecimal(amountLeft)} à dépenser sur le pass !`}
      </StyledBody>
      <Spacer.Column numberOfSpaces={4} />
      <StyledBody>
        {t`Tu peux retrouver toutes les informations concernant ta réservation sur l’application`}
      </StyledBody>
      <Spacer.Column numberOfSpaces={8} />
      <ButtonPrimaryWhite
        title={t`Voir ma réservation`}
        onPress={() => {
          analytics.logSeeMyBooking(params.offerId)
          navigate('BookingDetails', {
            id: params.bookingId,
            shouldFetchAll: true,
          })
        }}
      />
      <Spacer.Column numberOfSpaces={4} />
      <ButtonTertiaryWhite
        title={t`Retourner à l'accueil`}
        onPress={() => navigate('Home', { shouldDisplayLoginModal: false })}
      />
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
