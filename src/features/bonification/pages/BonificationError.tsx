import { useRoute } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { BonificationType } from 'features/bonification/enums'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { getSubscriptionPropConfig } from 'features/navigation/navigators/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { HappyFaceWithTear } from 'ui/svg/icons/HappyFaceWithTear'
import { Typo } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'

export function BonificationError() {
  const { params } = useRoute<UseRouteType<'BonificationError'>>()
  const isDisabilityBonification = params?.bonificationType === BonificationType.DISABILITY
  const navigateToForm = isDisabilityBonification
    ? getSubscriptionPropConfig('BonificationBirthPlace', {
        bonificationType: BonificationType.DISABILITY,
      })
    : getSubscriptionPropConfig('BonificationNames')

  return (
    <GenericInfoPage
      illustration={HappyFaceWithTear}
      title={`Oups...${LINE_BREAK} Un problème est survenu\u00a0!`}
      buttonPrimary={{ wording: 'Revenir vers le formulaire', navigateTo: navigateToForm }}
      buttonSecondary={{ wording: 'Revenir au catalogue', navigateTo: navigateToHomeConfig }}>
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
