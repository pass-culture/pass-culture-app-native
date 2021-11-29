import { t } from '@lingui/macro'
import React, { useState } from 'react'

import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { useIdentityCheckNavigation } from 'features/identityCheck/useIdentityCheckNavigation'
import { accessibilityAndTestId } from 'tests/utils'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InputError } from 'ui/components/inputs/InputError'
import { isNameValid } from 'ui/components/inputs/nameCheck'
import { TextInput } from 'ui/components/inputs/TextInput'
import { Spacer } from 'ui/theme'

export const SetName = () => {
  const { dispatch, profile } = useIdentityCheckContext()
  const [firstName, setFirstName] = useState(profile.name?.firstName ?? '')
  const [lastName, setLastName] = useState(profile.name?.lastName ?? '')
  const { navigateToNextScreen } = useIdentityCheckNavigation()

  const isValidFirstName = isNameValid(firstName)
  const isValidLastName = isNameValid(lastName)
  const disabled = !isValidFirstName || !isValidLastName

  function submitName() {
    if (disabled) return
    dispatch({ type: 'SET_NAME', payload: { firstName, lastName } })
    navigateToNextScreen()
  }

  return (
    <PageWithHeader
      title={t`Profil`}
      fixedTopChildren={<CenteredTitle title={t`Comment t'appelles-tu ?`} />}
      scrollChildren={
        <React.Fragment>
          <TextInput
            label={t`Prénom`}
            value={firstName}
            autoFocus={true}
            onChangeText={setFirstName}
            placeholder={t`Ton prénom`}
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
            {...accessibilityAndTestId(t`Entrée pour le nom`)}
          />
          <InputError
            visible={!isValidLastName && lastName.length > 0}
            messageId={t`Ton nom ne doit pas contenir de chiffres ou de caractères spéciaux.`}
            numberOfSpacesTop={2}
          />
        </React.Fragment>
      }
      fixedBottomChildren={
        <ButtonPrimary title={t`Continuer`} onPress={submitName} disabled={disabled} />
      }
    />
  )
}
