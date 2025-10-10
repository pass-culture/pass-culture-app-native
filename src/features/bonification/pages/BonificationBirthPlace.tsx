import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import { BonificationBirthPlaceSchema } from 'features/bonification/schemas/BonificationBirthPlaceSchema'
import {
  legalRepresentativeActions,
  useLegalRepresentative,
} from 'features/bonification/store/legalRepresentativeStore'
import { SubscriptionStackParamList } from 'features/navigation/SubscriptionStackNavigator/SubscriptionStackTypes'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { InputText } from 'ui/designSystem/InputText/InputText'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type FormValues = {
  birthCountry: string
  birthCity?: string
}

export const BonificationBirthPlace = () => {
  const { navigate } = useNavigation<StackNavigationProp<SubscriptionStackParamList>>()

  const storedLegalRepresentative = useLegalRepresentative()
  const { setBirthCountry, setBirthCity } = legalRepresentativeActions

  const { control, formState, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      birthCountry: storedLegalRepresentative.birthCountry ?? '',
      birthCity: storedLegalRepresentative.birthCity ?? '',
    },
    resolver: yupResolver(BonificationBirthPlaceSchema),
    mode: 'all',
  })

  const disabled = !formState.isValid

  async function saveBirthPlaceAndNavigate({ birthCountry, birthCity }: FormValues) {
    if (disabled) return
    // eslint-disable-next-line no-console
    console.log({ birthCountry, birthCity })
    setBirthCountry(birthCountry)
    if (birthCity) setBirthCity(birthCity)
    navigate('BonificationRecap')
  }

  useEnterKeyAction(disabled ? undefined : () => handleSubmit(saveBirthPlaceAndNavigate))

  return (
    <PageWithHeader
      title="Informations Personnelles"
      scrollChildren={
        <Form.MaxWidth>
          <ViewGap gap={4}>
            <Typo.Title3 {...getHeadingAttrs(2)}>
              {'Quel est son lieu de naissance\u00a0?'}
            </Typo.Title3>
            <Controller
              control={control}
              name="birthCountry"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <InputText
                  label="Pays de naissance"
                  value={value}
                  autoFocus
                  onChangeText={onChange}
                  requiredIndicator="explicit"
                  accessibilityHint={error?.message}
                  testID="Entrée pour le pays de naissance"
                  textContentType="countryName"
                  autoComplete="country"
                  errorMessage={error?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="birthCity"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <InputText
                  label="Ville de naissance"
                  value={value}
                  onChangeText={onChange}
                  requiredIndicator="explicit"
                  accessibilityHint={error?.message}
                  testID="Entrée pour la ville de naissance"
                  textContentType="addressCity"
                  autoComplete="postal-address-locality"
                  errorMessage={error?.message}
                />
              )}
            />
          </ViewGap>
        </Form.MaxWidth>
      }
      fixedBottomChildren={
        <ButtonPrimary
          type="submit"
          wording="Continuer"
          accessibilityLabel="Continuer vers le résumé"
          onPress={handleSubmit(saveBirthPlaceAndNavigate)}
          disabled={disabled}
        />
      }
    />
  )
}
