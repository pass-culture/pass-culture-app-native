import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'

import { GenderEnum } from 'api/gen'
import { usePostBonusQuotientFamilialMutation } from 'features/bonification/queries/usePostBonusQuotientFamilialMutation'
import {
  legalRepresentativeActions,
  useLegalRepresentative,
} from 'features/bonification/store/legalRepresentativeStore'
import { Summary } from 'features/identityCheck/components/Summary'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { SubscriptionStackParamList } from 'features/navigation/SubscriptionStackNavigator/SubscriptionStackTypes'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Checkbox } from 'ui/designSystem/Checkbox/Checkbox'
import { PageWithHeader } from 'ui/pages/PageWithHeader'

export const BonificationRecap = () => {
  const { navigate } = useNavigation<StackNavigationProp<SubscriptionStackParamList>>()
  const { title, firstNames, commonName, givenName, birthDate, birthCity, birthCountry } =
    useLegalRepresentative()
  const { resetLegalRepresentative } = legalRepresentativeActions
  const { mutate, isPending } = usePostBonusQuotientFamilialMutation({
    onSuccess: () => {
      resetLegalRepresentative()
      navigateToHome()
    },
    onError: (_error) => {
      navigate('BonificationError')
      // LOG TO SENTRY?
    },
  })

  const [accepted, setAccepted] = useState(false)

  const submit = () => {
    if (title && firstNames && givenName && birthDate && birthCountry) {
      mutate({
        gender: title === 'Madame' ? GenderEnum.Mme : GenderEnum['M.'],
        firstNames,
        commonName,
        lastName: givenName,
        birthDate: new Date(birthDate).toString(),
        birthCountryCogCode: birthCountry,
        birthCityCogCode: birthCity,
      })
    }
  }

  if (!title || !firstNames || !givenName || !birthDate || !birthCountry) {
    throw new Error("Couldn't retrieve data from storage")
  }

  const recapData = [
    { title: 'Nom', value: `${title} ${firstNames?.join(' ')} ${givenName.toUpperCase()}` },
    { title: 'Date de naissance', value: new Date(birthDate).toLocaleDateString() },
    { title: 'Pays de naissance', value: birthCountry },
  ]

  if (commonName) recapData.splice(1, 0, { title: 'Nom d’usage', value: commonName.toUpperCase() })
  if (birthCity) recapData.push({ title: 'Ville de naissance', value: birthCity })

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
              navigate('BonificationNames')
            }}
          />
        </ViewGap>
      }
    />
  )
}
