import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'

import { Summary } from 'features/identityCheck/components/Summary'
import { SubscriptionStackParamList } from 'features/navigation/SubscriptionStackNavigator/SubscriptionStackTypes'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Checkbox } from 'ui/designSystem/Checkbox/Checkbox'
import { PageWithHeader } from 'ui/pages/PageWithHeader'

export const BonificationRecap = () => {
  const { navigate } = useNavigation<StackNavigationProp<SubscriptionStackParamList>>()
  const [accepted, setAccepted] = useState(false)

  const [loading, setLoading] = useState(false)
  const submit = () => {
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      navigate('BonificationError')
    }, 4000)
  }
  return (
    <PageWithHeader
      title="Informations personnelles"
      scrollChildren={
        <ViewGap gap={4}>
          <Summary
            title="Ces informations sont-elles exactes&nbsp;?"
            data={[
              { title: 'Nom', value: 'Mr Jean Dupont' },
              { title: 'Date de naissance', value: '12/12/79' },
              { title: 'Lieu de naissance', value: 'Toulouse, France' },
            ]}
          />
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
