import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, {  useRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { ModalContent } from 'features/identityCheck/atoms/ModalContent'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import {  UseNavigationType } from 'features/navigation/RootNavigator'
import { accessibilityAndTestId } from 'tests/utils'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InputError } from 'ui/components/inputs/InputError'
import { isNameValid } from 'ui/components/inputs/nameCheck'
import { TextInput } from 'ui/components/inputs/TextInput'
import { Spacer } from 'ui/theme'

export const SetName = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const { dispatch } = useIdentityCheckContext()
  const { navigate } = useNavigation<UseNavigationType>()

  const nameInput = useRef<RNTextInput | null>(null)

  const isValidFirstName = isNameValid(firstName)
  const isValidLastName = isNameValid(lastName)
  const disabled = !isValidFirstName || !isValidLastName

  function submitName() {
    if (!disabled) {
      dispatch({ type: 'SET_NAME', payload: {firstName, lastName }})
      navigate('IdentityCheckCity')
    }
  }

  return (
    <PageWithHeader
      title={t`Profil`}
      scrollChildren={
        <ModalContent>
          <CenteredTitle title={t`Comment t'appelles-tu ?`} />
          <TextInput
            label={t`Prénom`}
            value={firstName}
            autoFocus={true}
            onChangeText={setFirstName}
            placeholder={t`Ton prénom`}
            ref={nameInput}
            {...accessibilityAndTestId(t`Entrée pour le prénom`)}
          />
          <InputError
            visible={!isValidFirstName && firstName.length > 0}
            messageId={t`Ton prénom ne doit pas contenir de chiffres ou de caractères spéciaux.`}
            numberOfSpacesTop={2}
          />
                    <Spacer.Column numberOfSpaces={6} />
          <TextInput
            label={t`Nom`}
            value={lastName}
            onChangeText={setLastName}
            placeholder={t`Ton nom`}
            ref={nameInput}
            {...accessibilityAndTestId(t`Entrée pour le nom`)}
          />
          <InputError
            visible={!isValidLastName && lastName.length > 0}
            messageId={t`Ton nom ne doit pas contenir de chiffres ou de caractères spéciaux.`}
            numberOfSpacesTop={2}
          />
        </ModalContent>
      }
      fixedBottomChildren={ <ButtonPrimary title={t`Continuer`} onPress={submitName} disabled={disabled} />}
    />
  )
}

