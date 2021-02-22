import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { TicketBooked } from 'ui/svg/icons/TicketBooked'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

export function BookingConfirmation() {
  const { goBack, navigate } = useNavigation<UseNavigationType>()

  return (
    <GenericInfoPage
      title={_(t`Réservation confirmée !`)}
      icon={TicketBooked}
      iconSize={getSpacing(65)}>
      <StyledBody>{_(t`Il te reste encore 140€ à dépenser sur le pass !`)}</StyledBody>
      <Spacer.Column numberOfSpaces={4} />
      <StyledBody>
        {_(
          t`Tu peux retrouver toutes les informations concernant ta réservation sur l’application`
        )}
      </StyledBody>
      <Spacer.Column numberOfSpaces={8} />
      <ButtonPrimaryWhite title={_(t`Voir ma réservation`)} onPress={goBack} />
      <Spacer.Column numberOfSpaces={4} />
      <ButtonTertiaryWhite
        title={_(t`Retourner à l'accueil`)}
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
