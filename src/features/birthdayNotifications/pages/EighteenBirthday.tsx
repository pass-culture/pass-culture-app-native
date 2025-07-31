import React, { useEffect } from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { getSubscriptionPropConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { storage } from 'libs/storage'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import BirthdayCake from 'ui/animations/onboarding_birthday_cake.json'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'

export function EighteenBirthday() {
  const { user } = useAuthContext()
  const pageWording = useGetPageWording(user?.requiresIdCheck)

  useEffect(() => {
    storage.saveObject('has_seen_eligible_card', true)
  }, [])

  return (
    <GenericInfoPage
      animation={BirthdayCake}
      title="Tu as 18 ans&nbsp;!"
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

const useGetPageWording = (userRequiresIdCheck?: boolean) => {
  const { eighteenYearsOldDeposit } = useDepositAmountsByAge()
  if (userRequiresIdCheck) {
    return {
      text: `Vérifie ton identité pour débloquer tes ${eighteenYearsOldDeposit}.`,
      buttonText: 'Vérifier mon identité',
    }
  }
  return {
    text: `Confirme tes informations personnelles pour débloquer tes ${eighteenYearsOldDeposit}.`,
    buttonText: 'Confirmer mes informations',
  }
}
