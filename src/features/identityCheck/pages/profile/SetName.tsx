import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import styled from 'styled-components/native'

import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { setNameSchema } from 'features/identityCheck/pages/profile/schemas/setNameSchema'
import { nameActions, useName } from 'features/identityCheck/pages/profile/store/nameStore'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { SubscriptionStackParamList } from 'features/navigation/SubscriptionStackNavigator/SubscriptionStackTypes'
import { Form } from 'ui/components/Form'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { Button } from 'ui/designSystem/Button/Button'
import { TextInput } from 'ui/designSystem/TextInput/TextInput'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { IdCard } from 'ui/svg/icons/IdCard'
import { Typo } from 'ui/theme'
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
  const { navigate } = useNavigation<NativeStackNavigationProp<SubscriptionStackParamList>>()

  const { control, formState, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      firstName: storedName?.firstName ?? '',
      lastName: storedName?.lastName ?? '',
    },
    resolver: yupResolver(setNameSchema),
    mode: 'all',
    delayError: 1000,
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
          <BannerContainer>
            <Banner Icon={IdCard} label={pageConfigByType[type].bannerMessage} />
          </BannerContainer>
          <ViewGap gap={6}>
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextInput
                  label="Prénom"
                  value={value}
                  onChangeText={onChange}
                  requiredIndicator="explicit"
                  accessibilityHint={error?.message}
                  testID="Entrée pour le prénom"
                  autoComplete="given-name"
                  errorMessage={error?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextInput
                  label="Nom"
                  value={value}
                  onChangeText={onChange}
                  requiredIndicator="explicit"
                  accessibilityHint={error?.message}
                  testID="Entrée pour le nom"
                  autoComplete="family-name"
                  errorMessage={error?.message}
                />
              )}
            />
          </ViewGap>
        </Form.MaxWidth>
      }
      fixedBottomChildren={
        <Button
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

const BannerContainer = styled.View(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.xl,
}))
