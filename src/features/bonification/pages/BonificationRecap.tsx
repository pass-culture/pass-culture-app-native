import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useState } from 'react'

import {
  legalRepresentativeActions,
  useLegalRepresentative,
} from 'features/bonification/store/legalRepresentativeStore'
import { Summary } from 'features/identityCheck/components/Summary'
import { SubscriptionStackParamList } from 'features/navigation/SubscriptionStackNavigator/SubscriptionStackTypes'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Checkbox } from 'ui/designSystem/Checkbox/Checkbox'
import { PageWithHeader } from 'ui/pages/PageWithHeader'

export const BonificationRecap = () => {
  const { navigate } = useNavigation<NativeStackNavigationProp<SubscriptionStackParamList>>()
  const { title, firstName, commonName, givenName, birthDate, birthCity, birthCountry } =
    useLegalRepresentative()
  const { resetLegalRepresentative } = legalRepresentativeActions

  const [accepted, setAccepted] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = () => {
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      resetLegalRepresentative() // change this to onSuccess of API call
      navigate('BonificationError')
    }, 4000)
  }

  if (!title || !firstName || !givenName || !birthDate || !birthCountry) {
    throw new Error("Couldn't retrieve data from storage")
  }

  const recapData = [
    { title: 'Nom', value: `${title} ${firstName} ${givenName}` },
    { title: 'Date de naissance', value: new Date(birthDate).toLocaleDateString() },
    { title: 'Pays de naissance', value: birthCountry },
  ]

  if (commonName) recapData.splice(1, 0, { title: 'Nom d’usage', value: commonName })
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
            isLoading={loading}
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
