import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation, useRoute } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { setNameSchema } from 'features/identityCheck/pages/profile/schemas/setNameSchema'
import { nameActions, useName } from 'features/identityCheck/pages/profile/store/nameStore'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { SubscriptionStackParamList } from 'features/navigation/SubscriptionStackNavigator/SubscriptionStackTypes'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { InputText } from 'ui/designSystem/InputText/InputText'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { IdCard } from 'ui/svg/icons/IdCard'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type FormValues = {
  firstName: string
  lastName: string
}

export const SetName = () => {
  const { params } = useRoute<UseRouteType<'SetName'>>()
  const type = params?.type ?? ProfileTypes.IDENTITY_CHECK // Fallback to most common scenario

  const identityCheckAndRecapExistingDataConfig = {
    headerTitle: 'Profil',
    title: 'Comment t’appelles-tu\u00a0?',
    bannerMessage:
      'Saisis ton nom et ton prénom tels qu’ils sont affichés sur ta pièce d’identité. Nous les vérifions et ils ne pourront plus être modifiés par la suite.',
    navigateParamsType: ProfileTypes.IDENTITY_CHECK,
  }

  const pageConfigByType = {
    [ProfileTypes.IDENTITY_CHECK]: identityCheckAndRecapExistingDataConfig,
    [ProfileTypes.BOOKING_FREE_OFFER_15_16]: {
      headerTitle: 'Informations personnelles',
      title: 'Renseigne ton prénom et ton nom',
      bannerMessage:
        'Pour réserver une offre gratuite, on a besoin de ton prénom, nom, ton lieu de résidence et adresse, ainsi que ton statut. Ces informations seront vérifiées par le partenaire culturel.',
    },
    [ProfileTypes.RECAP_EXISTING_DATA]: identityCheckAndRecapExistingDataConfig,
  }

  const storedName = useName()
  const { setName: setStoredName } = nameActions
  const { navigate } = useNavigation<StackNavigationProp<SubscriptionStackParamList>>()

  const { control, formState, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      firstName: storedName?.firstName ?? '',
      lastName: storedName?.lastName ?? '',
    },
    resolver: yupResolver(setNameSchema),
    mode: 'all',
  })

  const disabled = !formState.isValid

  async function submitName({ firstName, lastName }: FormValues) {
    if (disabled) return
    setStoredName({ firstName, lastName })
    navigate('SetCity', { type })
  }

  useEnterKeyAction(disabled ? undefined : () => handleSubmit(submitName))

  return (
    <PageWithHeader
      title={pageConfigByType[type].headerTitle}
      scrollChildren={
        <Form.MaxWidth>
          <Typo.Title3 {...getHeadingAttrs(2)}>{pageConfigByType[type].title}</Typo.Title3>
          <Spacer.Column numberOfSpaces={5} />
          <InfoBanner icon={IdCard} message={pageConfigByType[type].bannerMessage} />
          <Spacer.Column numberOfSpaces={4} />
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <InputText
                label="Prénom"
                value={value}
                autoFocus
                onChangeText={onChange}
                required="text"
                accessibilityHint={error?.message}
                testID="Entrée pour le prénom"
                textContentType="givenName"
                autoComplete="given-name"
                errorMessage={error?.message}
              />
            )}
          />
          <Spacer.Column numberOfSpaces={6} />
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <InputText
                label="Nom"
                value={value}
                onChangeText={onChange}
                required="text"
                accessibilityHint={error?.message}
                testID="Entrée pour le nom"
                textContentType="familyName"
                autoComplete="family-name"
                errorMessage={error?.message}
              />
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
