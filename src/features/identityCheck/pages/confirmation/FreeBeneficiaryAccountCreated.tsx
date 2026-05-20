import React from 'react'
import styled from 'styled-components/native'

import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import FrenchRepublicAnimation from 'ui/animations/french_republic_animation.json'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { Typo } from 'ui/theme'

export function FreeBeneficiaryAccountCreated() {
  useEnterKeyAction(navigateToHome)

  const {
    data: { homeEntryIdFreeOffers },
  } = useRemoteConfigQuery()

  return (
    <GenericInfoPage
      animation={FrenchRepublicAnimation}
      animationColoringMode="targeted"
      animationTargetShapeNames={['Fond 1', 'Gradient Fill 1']}
      animationTargetLayerNames={['étoile', 'cadre']}
      title="Bonne nouvelle&nbsp;!"
      buttonPrimary={{
        wording: 'Découvrir les offres gratuites\u00a0!',
        navigateTo: { screen: 'ThematicHome', params: { homeId: homeEntryIdFreeOffers } },
      }}
      buttonTertiary={{
        wording: 'Plus tard',
        navigateTo: { screen: 'TabNavigator', params: { screen: 'Home' } },
        icon: ClockFilled,
      }}>
      <StyledBody>Tes informations ont bien été enregistrées.</StyledBody>
      <StyledBody>
        A partir de maintenant, tu peux consulter et réserver l’ensemble de nos offres gratuites
        disponibles.
      </StyledBody>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  marginTop: theme.designSystem.size.spacing.l,
}))
