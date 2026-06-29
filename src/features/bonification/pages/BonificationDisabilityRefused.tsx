import { useRoute } from '@react-navigation/native'
import React from 'react'
import { styled } from 'styled-components/native'

import { BonificationType } from 'features/bonification/enums'
import { BonificationDisabilityRefusedType } from 'features/bonification/types/BonificationRefusedType'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { getSubscriptionPropConfig } from 'features/navigation/navigators/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { SadFace } from 'ui/svg/icons/SadFace'
import { Typo } from 'ui/theme'

export const BonificationDisabilityRefused = () => {
  const { params } = useRoute<UseRouteType<'BonificationDisabilityRefused'>>()

  const isTooManyRetriesError =
    params?.bonificationRefusedType === BonificationDisabilityRefusedType.TOO_MANY_RETRIES

  const tooManyRetriesText = isTooManyRetriesError ? (
    <StyledBodyXs>Prochaine demande possible demain</StyledBodyXs>
  ) : undefined

  return (
    <GenericInfoPage
      illustration={SadFace}
      title="Ton dossier est refusé"
      buttonsSurtitle={tooManyRetriesText}
      buttonPrimary={{
        wording: 'Renouveler ma demande',
        navigateTo: getSubscriptionPropConfig('BonificationRequiredInformation', {
          bonificationType: BonificationType.DISABILITY,
        }),
        disabled: isTooManyRetriesError,
      }}
      buttonTertiary={{
        wording: 'Retour à l’accueil',
        navigateTo: navigateToHomeConfig,
        icon: PlainArrowPrevious,
      }}>
      <ViewGap gap={4}>
        <StyledBody>
          Après vérification, tu ne réponds pas aux critères d’éligibilité permettant de bénéficier
          de ce bonus.
        </StyledBody>
        <StyledBody>
          Si ta situation change, tu pourras déposer une nouvelle demande et compléter les
          informations nécessaires.
        </StyledBody>
      </ViewGap>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const StyledBodyXs = styled(Typo.BodyXs)(({ theme }) => ({
  textAlign: 'center',
  color: theme.designSystem.color.text.disabled,
}))
