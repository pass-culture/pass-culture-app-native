import { t } from '@lingui/macro'
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { useIdentityCheckNavigation } from 'features/identityCheck/useIdentityCheckNavigation'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InputError } from 'ui/components/inputs/InputError'
import { isNameValid } from 'ui/components/inputs/nameCheck'
import { TextInput } from 'ui/components/inputs/TextInput'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { Spacer } from 'ui/theme'
import { Form } from 'ui/web/form/Form'

export const SetName = () => {
  const { dispatch, profile } = useIdentityCheckContext()
  const [firstName, setFirstName] = useState(profile.name?.firstName ?? '')
  const [lastName, setLastName] = useState(profile.name?.lastName ?? '')
  const { navigateToNextScreen } = useIdentityCheckNavigation()

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
      title={t`Profil`}
      fixedTopChildren={
        <React.Fragment>
          <CenteredTitle title={t`Comment t'appelles-tu\u00a0?`} />
          <Spacer.Column numberOfSpaces={5} />
        </React.Fragment>
      }
      scrollChildren={
        <Form.MaxWidth>
          <TextInput
            label={t`Prénom`}
            value={firstName}
            autoFocus={true}
            onChangeText={setFirstName}
            placeholder={t`Ton prénom`}
            textContentType="username"
            isRequiredField
            accessibilityDescribedBy={firstNameInputErrorId}
            {...accessibilityAndTestId(t`Entrée pour le prénom`)}
          />
          <InputError
            visible={firstNameHasError}
            messageId={t`Ton prénom ne doit pas contenir de chiffres ou de caractères spéciaux.`}
            numberOfSpacesTop={2}
            relatedInputId={firstNameInputErrorId}
          />
          <Spacer.Column numberOfSpaces={6} />
          <TextInput
            label={t`Nom`}
            value={lastName}
            onChangeText={setLastName}
            placeholder={t`Ton nom`}
            textContentType="username"
            isRequiredField
            accessibilityDescribedBy={lastNameInputErrorId}
            {...accessibilityAndTestId(t`Entrée pour le nom`)}
          />
          <InputError
            visible={lastNameHasError}
            messageId={t`Ton nom ne doit pas contenir de chiffres ou de caractères spéciaux.`}
            numberOfSpacesTop={2}
            relatedInputId={lastNameInputErrorId}
          />
        </Form.MaxWidth>
      }
      fixedBottomChildren={
        <ButtonPrimary
          type="submit"
          wording={t`Continuer`}
          accessibilityLabel={t`Continuer vers l'étape suivante`}
          onPress={submitName}
          disabled={disabled}
        />
      }
    />
  )
}
