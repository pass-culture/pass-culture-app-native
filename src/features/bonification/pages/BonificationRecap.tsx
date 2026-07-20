import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useState } from 'react'
import { View } from 'react-native'

import { GenderEnum } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { BonificationType } from 'features/bonification/enums'
import { StyledBodyXsSteps } from 'features/bonification/pages/BonificationNames'
import { usePostDisabilityBonificationMutation } from 'features/bonification/queries/usePostDisabilityBonificationMutation'
import { usePostQFBonificationMutation } from 'features/bonification/queries/usePostQFBonificationMutation'
import {
  disabilityBonificationActions,
  useDisabilityBonification,
} from 'features/bonification/store/disabilityBonificationStore'
import {
  qfBonificationActions,
  useQFBonification,
} from 'features/bonification/store/qfBonificationStore'
import { InfoListItemProps, Summary } from 'features/identityCheck/components/Summary'
import { UseNavigationType, UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/navigators/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { formatDateToISOStringWithoutTime } from 'libs/parsers/formatDates'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { Checkbox } from 'ui/designSystem/Checkbox/Checkbox'
import { showSuccessSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
import { PageWithHeader } from 'ui/pages/PageWithHeader'

export const BonificationRecap = () => {
  const { params } = useRoute<UseRouteType<'BonificationRecap'>>()
  const { navigate } = useNavigation<UseNavigationType>()

  const isDisabilityBonification = params?.bonificationType === BonificationType.DISABILITY
  const step = isDisabilityBonification ? 'Étape 2 sur 2' : 'Étape 5 sur 5'
  const checkboxLabel = isDisabilityBonification
    ? 'Je certifie que les informations saisies sont exactes.'
    : 'Je certifie avoir informé mon parent ou mon représentant légal des données personnelles communiquées.'

  const qf = useQFBonification()
  const disability = useDisabilityBonification()

  const { resetQFBonification } = qfBonificationActions
  const { resetDisabilityBonification } = disabilityBonificationActions

  const birthCountry = isDisabilityBonification ? disability.birthCountry : qf.birthCountry
  const birthCity = isDisabilityBonification ? disability.birthCity : qf.birthCity
  const { title, firstNames, commonName, givenName, birthDate } = qf

  const { refetchUser } = useAuthContext()

  const { mutate: mutateQFBonification, isPending } = usePostQFBonificationMutation({
    onSuccess: () => {
      navigate('TabNavigator', { screen: 'Home' })
      showSuccessSnackBar('Tes informations ont été envoyées\u00a0!')
      resetQFBonification()
      void refetchUser()
    },
    onError: (_error) => {
      navigate(
        ...getSubscriptionHookConfig('BonificationError', {
          bonificationType: BonificationType.FAMILY_QUOTIENT,
        })
      )
    },
  })

  const [accepted, setAccepted] = useState(false)

  const submitQFBonification = () => {
    if (title && firstNames && givenName && birthDate && birthCountry?.cog) {
      mutateQFBonification({
        gender: title === 'Madame' ? GenderEnum.Mme : GenderEnum['M.'],
        firstNames,
        commonName,
        lastName: givenName,
        birthDate: formatDateToISOStringWithoutTime(birthDate),
        birthCountryCogCode: birthCountry.cog.toString(),
        birthCityCogCode: birthCity?.code,
      })
    } else {
      navigate(
        ...getSubscriptionHookConfig('BonificationError', {
          bonificationType: BonificationType.FAMILY_QUOTIENT,
        })
      )
    }
  }

  const { mutate: mutateDisabilityBonification } = usePostDisabilityBonificationMutation({
    onSuccess: () => {
      navigate('TabNavigator', { screen: 'Home' })
      showSuccessSnackBar('Tes informations ont été envoyées\u00a0!')
      resetDisabilityBonification()
      void refetchUser()
    },
    onError: (_error) => {
      navigate(
        ...getSubscriptionHookConfig('BonificationError', {
          bonificationType: BonificationType.DISABILITY,
        })
      )
    },
  })

  const submitDisabilityBonification = () => {
    if (birthCountry?.cog) {
      mutateDisabilityBonification({
        birthCountryCogCode: birthCountry.cog.toString(),
        birthCityCogCode: birthCity?.code,
      })
    } else {
      navigate(
        ...getSubscriptionHookConfig('BonificationError', {
          bonificationType: BonificationType.DISABILITY,
        })
      )
    }
  }

  const submit = isDisabilityBonification ? submitDisabilityBonification : submitQFBonification
  const onPressModify = isDisabilityBonification
    ? () =>
        navigate(
          ...getSubscriptionHookConfig('BonificationBirthPlace', {
            bonificationType: BonificationType.DISABILITY,
          })
        )
    : () => navigate(...getSubscriptionHookConfig('BonificationNames'))

  const recapData: InfoListItemProps[] = []

  if (!isDisabilityBonification) {
    if (title) {
      recapData.push({ title: 'Civilité', value: title })
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
      shouldDisplayBottomGradient
      scrollChildren={
        <ViewGap gap={4}>
          <View>
            <StyledBodyXsSteps>{step}</StyledBodyXsSteps>
            <Summary title="Vérifie les informations avant d’envoyer ta demande" data={recapData} />
          </View>
          <Checkbox
            label={checkboxLabel}
            variant="default"
            isChecked={accepted}
            onPress={() => setAccepted((v) => !v)}
          />
        </ViewGap>
      }
      fixedBottomChildren={
        <ViewGap gap={4}>
          <Button
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
            onPress={onPressModify}
          />
        </ViewGap>
      }
    />
  )
}
