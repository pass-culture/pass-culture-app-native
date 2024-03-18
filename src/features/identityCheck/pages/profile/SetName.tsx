import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'

import { CenteredTitle } from 'features/identityCheck/components/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { setNameSchema } from 'features/identityCheck/pages/profile/schemas/setNameSchema'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { storage } from 'libs/storage'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { InputError } from 'ui/components/inputs/InputError'
import { TextInput } from 'ui/components/inputs/TextInput'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { BicolorIdCard } from 'ui/svg/icons/BicolorIdCard'
import { Spacer } from 'ui/theme'

type FormValues = {
  firstName: string
  lastName: string
}
export const SetName = () => {
  const { dispatch, profile } = useSubscriptionContext()
  const { navigate } = useNavigation<UseNavigationType>()

  const { control, formState, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      firstName: profile.name?.firstName ?? '',
      lastName: profile.name?.lastName ?? '',
    },
    resolver: yupResolver(setNameSchema),
    mode: 'all',
  })

  const { firstName, lastName } = watch()

  useEffect(() => {
    analytics.logScreenViewSetName()
  }, [])

  const disabled = !formState.isValid
  const firstNameInputErrorId = uuidv4()
  const lastNameInputErrorId = uuidv4()

  async function submitName({ firstName, lastName }: FormValues) {
    if (disabled) return
    dispatch({ type: 'SET_NAME', payload: { firstName, lastName } })
    await storage.saveObject('activation_profile', { name: { firstName, lastName } })
    analytics.logSetNameClicked()
    navigate('SetCity')
  }

  useEnterKeyAction(!disabled ? () => handleSubmit(submitName) : undefined)

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
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <React.Fragment>
                <TextInput
                  label="Prénom"
                  value={value}
                  autoFocus
                  onChangeText={onChange}
                  placeholder="Ton prénom"
                  textContentType="username"
                  isRequiredField
                  accessibilityDescribedBy={firstNameInputErrorId}
                  testID="Entrée pour le prénom"
                />
                <InputError
                  visible={firstName.length > 0 && !!error}
                  messageId={error?.message}
                  numberOfSpacesTop={2}
                  relatedInputId={firstNameInputErrorId}
                />
              </React.Fragment>
            )}
          />
          <Spacer.Column numberOfSpaces={6} />
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <React.Fragment>
                <TextInput
                  label="Nom"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Ton nom"
                  textContentType="username"
                  isRequiredField
                  accessibilityDescribedBy={lastNameInputErrorId}
                  testID="Entrée pour le nom"
                />
                <InputError
                  visible={lastName.length > 0 && !!error}
                  messageId={error?.message}
                  numberOfSpacesTop={2}
                  relatedInputId={lastNameInputErrorId}
                />
              </React.Fragment>
            )}
          />
        </Form.MaxWidth>
      }
      fixedBottomChildren={
        <ButtonPrimary
          type="submit"
          wording="Continuer"
          accessibilityLabel="Continuer vers l’étape suivante"
          onPress={handleSubmit(submitName)}
          disabled={disabled}
        />
      }
    />
  )
}
