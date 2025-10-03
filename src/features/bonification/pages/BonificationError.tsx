import React from 'react'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { getSubscriptionPropConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { HappyFaceWithTear } from 'ui/svg/icons/HappyFaceWithTear'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { Typo } from 'ui/theme'

export function BonificationError() {
  return (
    <GenericInfoPage
      illustration={HappyFaceWithTear}
      title="Oups... Un problème est survenu&nbsp;!"
      buttonPrimary={{
        wording: 'Retourner vers le formulaire',
        navigateTo: getSubscriptionPropConfig('BonificationNames'),
      }}
      buttonSecondary={{
        wording: 'Retourner à l’accueil',
        navigateTo: navigateToHomeConfig,
        icon: PlainArrowPrevious,
      }}>
      <ViewGap gap={4}>
        <StyledBody>BLA BLA</StyledBody>
        <StyledBody>BLA BLA</StyledBody>
      </ViewGap>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
