import React, { useEffect } from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { storage } from 'libs/storage'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import TutorialPassLogo from 'ui/animations/eighteen_birthday.json'
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
      animation={TutorialPassLogo}
      title="Tu as 18 ans&nbsp;!"
      subtitle={pageWording.text}
      buttonPrimary={{
        wording: pageWording.buttonText,
        navigateTo: { screen: 'Stepper' },
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
