import { useRoute } from '@react-navigation/native'
import React from 'react'
import { styled } from 'styled-components/native'

import { BonificationType } from 'features/bonification/enums'
import { BonificationDisabilityRefusedType } from 'features/bonification/types/BonificationRefusedType'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { getSubscriptionPropConfig } from 'features/navigation/navigators/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { SadFace } from 'ui/svg/icons/SadFace'
import { Typo } from 'ui/theme'

export const BonificationDisabilityRefused = () => {
  const { params } = useRoute<UseRouteType<'BonificationDisabilityRefused'>>()

  const disableHandicapBonificationButton = useFeatureFlag(
    RemoteStoreFeatureFlags.DISABLE_HANDICAP_BONIFICATION_MANUAL_REQUEST
  )

  const isTooManyRetriesError =
    params?.bonificationRefusedType === BonificationDisabilityRefusedType.TOO_MANY_RETRIES

  const disabledNewRequest = disableHandicapBonificationButton || isTooManyRetriesError

  const tooManyRetriesText = isTooManyRetriesError ? (
    <StyledBodyXs>Prochaine demande possible demain</StyledBodyXs>
  ) : undefined

  return (
    <GenericInfoPage
      illustration={SadFace}
      title="Ton dossier est refusé"
      buttonsSurtitle={tooManyRetriesText}
      buttonPrimary={{
        disabled: disabledNewRequest,
        wording: 'Renouveler ma demande',
        navigateTo: getSubscriptionPropConfig('BonificationRequiredInformation', {
          bonificationType: BonificationType.DISABILITY,
        }),
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
          Si ta situation change au cours de tes 18 ans et que tu remplis les conditions, tu pourras
          refaire une demande et compléter les informations nécessaires.
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
