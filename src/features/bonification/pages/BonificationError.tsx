import React from 'react'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { getSubscriptionPropConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { HappyFaceWithTear } from 'ui/svg/icons/HappyFaceWithTear'
import { Typo } from 'ui/theme'

export function BonificationError() {
  return (
    <GenericInfoPage
      illustration={HappyFaceWithTear}
      title="Oups... Un problème est survenu&nbsp;!"
      buttonPrimary={{
        wording: 'Revenir vers le formulaire',
        navigateTo: getSubscriptionPropConfig('BonificationNames'),
      }}
      buttonSecondary={{
        wording: 'Revenir au catalogue',
        navigateTo: navigateToHomeConfig,
      }}>
      <ViewGap gap={4}>
        <StyledBody>
          Il semble que ta connexion ait été interrompue ou qu’un problème technique soit survenu.
        </StyledBody>
        <StyledBody>Tu peux réessayer d’envoyer ta demande maintenant.</StyledBody>
      </ViewGap>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
