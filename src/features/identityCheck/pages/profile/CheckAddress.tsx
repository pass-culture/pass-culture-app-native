import { useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { PersonalDataTypes } from 'features/navigation/navigators/ProfileStackNavigator/enums'
import { getProfileHookConfig } from 'features/navigation/navigators/ProfileStackNavigator/getProfileHookConfig'
import { UseNavigationType, UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/navigators/SubscriptionStackNavigator/getSubscriptionHookConfig'

import { CheckAddressPage } from './CheckAddressPage'

export function CheckAddress() {
  const { params } = useRoute<UseRouteType<'CheckAddress'>>()
  const { user } = useAuthContext()
  const [navigator, screenConfig] = getSubscriptionHookConfig('BeneficiaryAccountCreated', {
    from: 'IdentityCheckHonor',
  })
  const { navigate } = useNavigation<UseNavigationType>()

  return (
    <CheckAddressPage
      address={user?.street}
      city={`${user?.postalCode}, ${user?.city}`}
      summaryTitle={
        params?.fromChangeAddress
          ? 'Vérifie que ces informations sont correctes avant de continuer'
          : 'Habites-tu toujours à cette adresse\u00a0?'
      }
      onValidate={() => navigate(navigator, { ...screenConfig, params: { from: 'CheckAddress' } })}
      onPressModify={() =>
        navigate(
          ...getProfileHookConfig('ChangeCity', {
            type: PersonalDataTypes.CHECK_ADDRESS,
          })
        )
      }
    />
  )
}
