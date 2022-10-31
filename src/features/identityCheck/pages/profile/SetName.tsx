import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { useSubscriptionNavigation } from 'features/identityCheck/useSubscriptionNavigation'
import { Banner } from 'ui/components/Banner'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { InputError } from 'ui/components/inputs/InputError'
import { isNameValid } from 'ui/components/inputs/nameCheck'
import { TextInput } from 'ui/components/inputs/TextInput'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { Spacer } from 'ui/theme'

export const SetName = () => {
  const { dispatch, profile } = useSubscriptionContext()
  const [firstName, setFirstName] = useState(profile.name?.firstName ?? '')
  const [lastName, setLastName] = useState(profile.name?.lastName ?? '')
  const { navigateToNextScreen } = useSubscriptionNavigation()

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
    navigateToNextScreen()
  }

  useEnterKeyAction(!disabled ? submitName : undefined)

  return (
    <PageWithHeader
      title="Profil"
      fixedTopChildren={
        <React.Fragment>
          <CenteredTitle title="Comment t’appelles-tu&nbsp;?" />
          <Spacer.Column numberOfSpaces={5} />
        </React.Fragment>
      }
      scrollChildren={
        <Form.MaxWidth>
          <Banner title="Saisis ton nom et ton prénom tels qu’ils sont affichés sur ta carte d’identité." />
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
