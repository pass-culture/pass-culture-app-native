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
import { InfoListItemProps, Summary } from 'features/identityCheck/components/Summary'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
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
    if (title && firstNames && givenName && birthDate && birthCountry?.cog) {
      mutate({
        gender: title === 'Madame' ? GenderEnum.Mme : GenderEnum['M.'],
        firstNames,
        commonName,
        lastName: givenName,
        birthDate: new Date(birthDate).toISOString().substring(0, 10),
        birthCountryCogCode: birthCountry.cog.toString(),
        birthCityCogCode: birthCity?.code,
      })
    } else {
      navigate(...getSubscriptionHookConfig('BonificationError'))
    }
  }

  const recapData: InfoListItemProps[] = []

  if (title) {
    recapData.push({
      title: 'Civilité',
      value: title,
    })
  }

  if (givenName) {
    recapData.push({
      title: 'Nom de naissance',
      value: givenName.toUpperCase(),
    })
  }

  if (firstNames?.length) {
    recapData.push({
      title: 'Prénom(s)',
      value: firstNames.join(', '),
    })
  }

  if (commonName) {
    recapData.push({
      title: 'Nom d’usage',
      value: commonName.toUpperCase(),
    })
  }

  if (birthDate) {
    recapData.push({
      title: 'Date de naissance',
      value: new Date(birthDate).toLocaleDateString(),
    })
  }

  if (birthCountry) {
    recapData.push({
      title: 'Pays de naissance',
      value: birthCountry.libcog.toString(),
    })
  }

  if (birthCity?.name) {
    recapData.push({
      title: 'Ville de naissance',
      value: `${birthCity.name}, ${birthCity.postalCode}`,
    })
  }

  if (!recapData.length) {
    recapData.push({
      title: 'Erreur',
      value: 'Nous ne retrouvons pas les données du formulaire',
    })
  }

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
          <Button
            variant="primary"
            isLoading={isPending}
            type="submit"
            fullWidth
            wording="Confirmer"
            onPress={submit}
            disabled={!accepted}
          />
          <Button
            variant="secondary"
            color="neutral"
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
