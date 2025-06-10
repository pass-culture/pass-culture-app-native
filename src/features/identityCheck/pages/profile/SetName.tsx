import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'

import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { setNameSchema } from 'features/identityCheck/pages/profile/schemas/setNameSchema'
import { nameActions, useName } from 'features/identityCheck/pages/profile/store/nameStore'
import {
  SubscriptionRootStackParamList,
  UseNavigationType,
} from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { InputError } from 'ui/components/inputs/InputError'
import { TextInput } from 'ui/components/inputs/TextInput'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { IdCard } from 'ui/svg/icons/IdCard'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type FormValues = {
  firstName: string
  lastName: string
}

type Props = StackScreenProps<SubscriptionRootStackParamList, 'SetName'>

export const SetName: FunctionComponent<Props> = ({ route }: Props) => {
  const type = route.params.type
  const isIdentityCheck = type === ProfileTypes.IDENTITY_CHECK
  const pageInfos = isIdentityCheck
    ? {
        headerTitle: 'Profil',
        title: 'Comment t’appelles-tu\u00a0?',
        bannerMessage:
          'Saisis ton nom et ton prénom tels qu’ils sont affichés sur ta pièce d’identité. Nous les vérifions et ils ne pourront plus être modifiés par la suite.',
        navigateParamsType: ProfileTypes.IDENTITY_CHECK,
      }
    : {
        headerTitle: 'Informations personnelles',
        title: 'Renseigne ton prénom et ton nom',
        bannerMessage:
          'Pour réserver une offre gratuite, on a besoin de ton prénom, nom, ton lieu de résidence et adresse, ainsi que ton statut. Ces informations seront vérifiées par le partenaire culturel.',
        navigateParamsType: ProfileTypes.BOOKING_FREE_OFFER_15_16,
      }

  const storedName = useName()
  const { setName: setStoredName } = nameActions
  const { navigate } = useNavigation<UseNavigationType>()

  const { control, formState, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      firstName: storedName?.firstName ?? '',
      lastName: storedName?.lastName ?? '',
    },
    resolver: yupResolver(setNameSchema),
    mode: 'all',
  })

  const { firstName, lastName } = watch()

  const disabled = !formState.isValid
  const firstNameInputErrorId = uuidv4()
  const lastNameInputErrorId = uuidv4()

  async function submitName({ firstName, lastName }: FormValues) {
    if (disabled) return
    setStoredName({ firstName, lastName })
    analytics.logSetNameClicked()
    navigate('SetCity', { type: pageInfos.navigateParamsType })
  }

  useEnterKeyAction(disabled ? undefined : () => handleSubmit(submitName))

  return (
    <PageWithHeader
      title={pageInfos.headerTitle}
      scrollChildren={
        <Form.MaxWidth>
          <Typo.Title3 {...getHeadingAttrs(2)}>{pageInfos.title}</Typo.Title3>
          <Spacer.Column numberOfSpaces={5} />
          <InfoBanner icon={IdCard} message={pageInfos.bannerMessage} />
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
                  isRequiredField
                  accessibilityDescribedBy={firstNameInputErrorId}
                  testID="Entrée pour le prénom"
                  textContentType="givenName"
                  autoComplete="given-name"
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
                  isRequiredField
                  accessibilityDescribedBy={lastNameInputErrorId}
                  testID="Entrée pour le nom"
                  textContentType="familyName"
                  autoComplete="family-name"
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
          accessibilityLabel="Continuer vers la ville de résidence"
          onPress={handleSubmit(submitName)}
          disabled={disabled}
        />
      }
    />
  )
}
