import React, { useEffect } from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { getSubscriptionPropConfig } from 'features/navigation/navigators/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { storage } from 'libs/storage'
import { remoteIllustrationUrls } from 'shared/illustrations/remoteIllustrations'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import BirthdayCake from 'ui/animations/onboarding_birthday_cake.json'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'

export function UnlockCredit() {
  const { user } = useAuthContext()
  const enableNewVisionUi = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_VISION_UI)
  const enableSimplifiedActivation18 = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_SIMPLIFIED_ACTIVATION_18
  )
  const { eighteenYearsOldDeposit } = useDepositAmountsByAge()

  useEffect(() => {
    void storage.saveObject('has_seen_eligible_card', true)
  }, [])

  const pageWording = getPageWording({
    eighteenYearsOldDeposit,
    userRequiresIdCheck: user?.requiresIdCheck,
    enableSimplifiedActivation18,
  })

  return (
    <GenericInfoPage
      animation={BirthdayCake}
      animationColoringMode="targeted"
      animationTargetShapeNames={['Fond 1', 'Gradient Fill 1']}
      remoteIllustration={
        enableNewVisionUi
          ? {
              url: remoteIllustrationUrls.birthdayCake,
              backgroundColor: 'information02',
            }
          : undefined
      }
      title={pageWording.title}
      subtitle={pageWording.text}
      buttonPrimary={{
        wording: pageWording.buttonText,
        navigateTo: getSubscriptionPropConfig('Stepper'),
      }}
      buttonTertiary={{
        wording: 'Plus tard',
        navigateTo: { screen: 'TabNavigator', params: { screen: 'Home' } },
        icon: ClockFilled,
      }}
    />
  )
}

const getPageWording = ({
  userRequiresIdCheck,
  enableSimplifiedActivation18,
  eighteenYearsOldDeposit,
}: {
  userRequiresIdCheck?: boolean
  enableSimplifiedActivation18: boolean
  eighteenYearsOldDeposit: string
}) => {
  if (enableSimplifiedActivation18) {
    return {
      title: 'Obtiens ton crédit\u00a0',
      text: `Vérifie tes informations pour débloquer tes ${eighteenYearsOldDeposit}.`,
      buttonText: 'Débloquer mon crédit',
    }
  } else if (userRequiresIdCheck) {
    return {
      title: 'Tu as 18 ans\u00a0!',
      text: `Vérifie ton identité pour débloquer tes ${eighteenYearsOldDeposit}.`,
      buttonText: 'Vérifier mon identité',
    }
  }
  return {
    title: 'Tu as 18 ans\u00a0!',
    text: `Confirme tes informations personnelles pour débloquer tes ${eighteenYearsOldDeposit}.`,
    buttonText: 'Confirmer mes informations',
  }
}
