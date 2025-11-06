import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'

import { GenderEnum } from 'api/gen'
import { usePostBonusQuotientFamilialMutation } from 'features/bonification/queries/usePostBonusQuotientFamilialMutation'
import { useLegalRepresentative } from 'features/bonification/store/legalRepresentativeStore'
import { Summary } from 'features/identityCheck/components/Summary'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Checkbox } from 'ui/designSystem/Checkbox/Checkbox'
import { PageWithHeader } from 'ui/pages/PageWithHeader'

export const BonificationRecap = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { title, firstNames, commonName, givenName, birthDate, birthCity, birthCountry } =
    useLegalRepresentative()
  // const { resetLegalRepresentative } = legalRepresentativeActions

  const { mutate, isPending } = usePostBonusQuotientFamilialMutation({
    onSuccess: () => {
      navigate('TabNavigator', { screen: 'Home' }) // we navigate first or error will be thrown
      // resetLegalRepresentative()
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
    }
  }

  if (!title || !firstNames || !givenName || !birthDate || !birthCountry) {
    throw new Error("Couldn't retrieve data from storage")
  }

  const recapData = [
    { title: 'Nom', value: `${title} ${firstNames?.join(' ')} ${givenName.toUpperCase()}` },
    { title: 'Date de naissance', value: new Date(birthDate).toLocaleDateString() },
    { title: 'Pays de naissance', value: birthCountry.LIBCOG.toString() },
  ]

  if (commonName) recapData.splice(1, 0, { title: 'Nom d’usage', value: commonName.toUpperCase() })
  if (birthCity?.name) recapData.push({ title: 'Ville de naissance', value: birthCity?.name })

  return (
    <PageWithHeader
      title="Informations personnelles"
      scrollChildren={
        <ViewGap gap={4}>
          <Summary title="Ces informations sont-elles exactes&nbsp;?" data={recapData} />
          <Checkbox
            label="Je déclare que l’ensemble des informations que j’ai renseignées sont correctes."
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
            wording="Envoyer"
            accessibilityLabel="Envoyer les informations"
            onPress={submit}
            disabled={!accepted}
          />
          <ButtonSecondary
            type="button"
            wording="Modifier les informations"
            onPress={() => {
              navigate(...getSubscriptionHookConfig('BonificationNames'))
            }}
          />
        </ViewGap>
      }
    />
  )
}
