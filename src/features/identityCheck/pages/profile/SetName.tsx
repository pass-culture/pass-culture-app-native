import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CenteredTitle } from 'features/identityCheck/components/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { InputError } from 'ui/components/inputs/InputError'
import { isNameValid } from 'ui/components/inputs/nameCheck'
import { TextInput } from 'ui/components/inputs/TextInput'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { BicolorIdCard } from 'ui/svg/icons/BicolorIdCard'
import { Spacer } from 'ui/theme'

export const SetName = () => {
  const { dispatch, profile } = useSubscriptionContext()
  const [firstName, setFirstName] = useState(profile.name?.firstName ?? '')
  const [lastName, setLastName] = useState(profile.name?.lastName ?? '')
  const { navigate } = useNavigation<UseNavigationType>()

  useEffect(() => {
    analytics.logScreenViewSetName()
  }, [])

  const isValidFirstName = isNameValid(firstName)
  const isValidLastName = isNameValid(lastName)
  const disabled = !isValidFirstName || !isValidLastName
  const firstNameInputErrorId = uuidv4()
  const lastNameInputErrorId = uuidv4()

  const firstNameHasError = !isValidFirstName && firstName.length > 0
  const lastNameHasError = !isValidLastName && lastName.length > 0

  function submitName() {
    if (disabled) return
    dispatch({ type: 'SET_NAME', payload: { firstName, lastName } })
    analytics.logSetNameClicked()
    navigate('SetCity')
  }

  useEnterKeyAction(!disabled ? submitName : undefined)

  return (
    <PageWithHeader
      title="Profil"
      scrollChildren={
        <Form.MaxWidth>
          <CenteredTitle title="Comment t’appelles-tu&nbsp;?" />
          <Spacer.Column numberOfSpaces={5} />
          <InfoBanner
            icon={BicolorIdCard}
            message="Saisis ton nom et ton prénom tels qu’ils sont affichés sur ta pièce d’identité.
Nous les vérifions et ils ne pourront plus être modifiés par la suite."
          />
          <Spacer.Column numberOfSpaces={4} />
          <TextInput
            label="Prénom"
            value={firstName}
            autoFocus
            onChangeText={setFirstName}
            placeholder="Ton prénom"
            textContentType="username"
            isRequiredField
            accessibilityDescribedBy={firstNameInputErrorId}
            testID="Entrée pour le prénom"
          />
          <InputError
            visible={firstNameHasError}
            messageId="Ton prénom ne doit pas contenir de chiffres ou de caractères spéciaux."
            numberOfSpacesTop={2}
            relatedInputId={firstNameInputErrorId}
          />
          <Spacer.Column numberOfSpaces={6} />
          <TextInput
            label="Nom"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Ton nom"
            textContentType="username"
            isRequiredField
            accessibilityDescribedBy={lastNameInputErrorId}
            testID="Entrée pour le nom"
          />
          <InputError
            visible={lastNameHasError}
            messageId="Ton nom ne doit pas contenir de chiffres ou de caractères spéciaux."
            numberOfSpacesTop={2}
            relatedInputId={lastNameInputErrorId}
          />
        </Form.MaxWidth>
      }
      fixedBottomChildren={
        <ButtonPrimary
          type="submit"
          wording="Continuer"
          accessibilityLabel="Continuer vers l’étape suivante"
          onPress={submitName}
          disabled={disabled}
        />
      }
    />
  )
}
