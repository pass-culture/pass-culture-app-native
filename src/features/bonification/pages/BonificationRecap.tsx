import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { View } from 'react-native'

import { GenderEnum } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { StyledBodyXsSteps } from 'features/bonification/pages/BonificationNames'
import { usePostBonusQuotientFamilialMutation } from 'features/bonification/queries/usePostBonusQuotientFamilialMutation'
import {
  legalRepresentativeActions,
  useLegalRepresentative,
} from 'features/bonification/store/legalRepresentativeStore'
import { Summary } from 'features/identityCheck/components/Summary'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Checkbox } from 'ui/designSystem/Checkbox/Checkbox'
import { PageWithHeader } from 'ui/pages/PageWithHeader'

export const BonificationRecap = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { title, firstNames, commonName, givenName, birthDate, birthCity, birthCountry } =
    useLegalRepresentative()
  const { resetLegalRepresentative } = legalRepresentativeActions
  const { refetchUser } = useAuthContext()
  const { showSuccessSnackBar } = useSnackBarContext()

  const { mutate, isPending } = usePostBonusQuotientFamilialMutation({
    onSuccess: () => {
      navigate('TabNavigator', { screen: 'Home' })
      showSuccessSnackBar({
        message: 'Tes informations ont été envoyées\u00a0!',
        timeout: SNACK_BAR_TIME_OUT,
      })
      resetLegalRepresentative()
      void refetchUser()
    },
    onError: (_error) => {
      navigate(...getSubscriptionHookConfig('BonificationError'))
      // LOG TO SENTRY?
    },
  })

  const [accepted, setAccepted] = useState(false)

  const submit = () => {
    if (title && firstNames && givenName && birthDate && birthCountry?.COG) {
      mutate({
        gender: title === 'Madame' ? GenderEnum.Mme : GenderEnum['M.'],
        firstNames,
        commonName,
        lastName: givenName,
        birthDate: new Date(birthDate).toISOString().substring(0, 10),
        birthCountryCogCode: birthCountry.COG.toString(),
        birthCityCogCode: birthCity?.code,
      })
    } else {
      navigate(...getSubscriptionHookConfig('BonificationError'))
    }
  }

  const recapData = [
    {
      title: 'Erreur',
      value: 'Nous ne retrouvons pas les données du formulaire',
    },
  ]

  if (title && firstNames?.length && givenName)
    recapData.splice(0, 1, {
      title: 'Nom',
      value: `${title} ${firstNames?.join(' ')} ${givenName.toUpperCase()}`,
    })
  if (commonName) recapData.push({ title: 'Nom d’usage', value: commonName.toUpperCase() })
  if (birthDate)
    recapData.push({ title: 'Date de naissance', value: new Date(birthDate).toLocaleDateString() })
  if (birthCountry)
    recapData.push({ title: 'Pays de naissance', value: birthCountry.LIBCOG.toString() })
  if (birthCity?.name) recapData.push({ title: 'Ville de naissance', value: birthCity?.name })

  return (
    <PageWithHeader
      title="Informations"
      scrollChildren={
        <ViewGap gap={4}>
          <View>
            <StyledBodyXsSteps>Étape 5 sur 5</StyledBodyXsSteps>
            <Summary title="Vérifie les infos avant d’envoyer ta demande" data={recapData} />
          </View>
          <Checkbox
            label="Je certifie avoir informé mon parent ou mon représentant légal des données personnelles communiquées"
            variant="default"
            isChecked={accepted}
            onPress={() => {
              setAccepted((prev) => !prev)
            }}
          />
        </ViewGap>
      }
      fixedBottomChildren={
        <ViewGap gap={4}>
          <ButtonPrimary
            isLoading={isPending}
            type="submit"
            wording="Confirmer"
            onPress={submit}
            disabled={!accepted}
          />
          <ButtonSecondary
            type="button"
            wording="Modifier mes informations"
            onPress={() => {
              navigate(...getSubscriptionHookConfig('BonificationNames'))
            }}
          />
        </ViewGap>
      }
    />
  )
}
