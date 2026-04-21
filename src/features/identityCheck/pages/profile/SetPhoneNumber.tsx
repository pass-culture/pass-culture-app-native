import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { CountryPicker } from 'features/identityCheck/components/countryPicker/CountryPicker'
import { findCountry } from 'features/identityCheck/pages/phoneValidation/helpers/findCountry'
import {
  PhoneNumberFormValues,
  phoneNumberSchema,
} from 'features/identityCheck/pages/phoneValidation/helpers/phoneNumberSchema'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import {
  phoneNumberActions,
  usePhoneNumber,
} from 'features/identityCheck/pages/profile/store/phoneNumberStore'
import { UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { SubscriptionStackParamList } from 'features/navigation/navigators/SubscriptionStackNavigator/types'
import { METROPOLITAN_FRANCE } from 'shared/countries/constants'
import {
  getCountryIdFromPhoneNumber,
  getNationalNumber,
} from 'shared/phoneNumber/helperPhoneNumber'
import { Form } from 'ui/components/Form'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { Button } from 'ui/designSystem/Button/Button'
import { TextInput } from 'ui/designSystem/TextInput/TextInput'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const SetPhoneNumber = () => {
  const { params } = useRoute<UseRouteType<'SetPhoneNumber'>>()
  const type = params?.type ?? ProfileTypes.IDENTITY_CHECK // Fallback to most common scenario
  const { user } = useAuthContext()
  const { setPhoneNumber: setStoredPhoneNumber } = phoneNumberActions
  const storedPhoneNumber = usePhoneNumber()
  const { navigate } = useNavigation<NativeStackNavigationProp<SubscriptionStackParamList>>()

  const getUserPhoneNumber = () => {
    if (user?.phoneNumber) {
      return getNationalNumber(user.phoneNumber)
    } else if (storedPhoneNumber?.phoneNumber) {
      return getNationalNumber(storedPhoneNumber.phoneNumber)
    } else {
      return ''
    }
  }
  const getUserCountryId = () => {
    if (user?.phoneNumber) {
      return getCountryIdFromPhoneNumber(user.phoneNumber)
    } else if (storedPhoneNumber?.countryId) {
      return storedPhoneNumber.countryId
    } else {
      return METROPOLITAN_FRANCE.id
    }
  }

  const { control, handleSubmit, formState } = useForm<PhoneNumberFormValues>({
    resolver: yupResolver(phoneNumberSchema),
    defaultValues: {
      phoneNumber: getUserPhoneNumber(),
      countryId: getUserCountryId(),
    },
    mode: 'onChange',
  })

  const disabled = !formState.isValid

  async function submitPhoneNumber({ phoneNumber, countryId }: PhoneNumberFormValues) {
    if (disabled) return
    setStoredPhoneNumber({ phoneNumber, countryId })
    navigate('SetStatus', { type })
  }

  useEnterKeyAction(disabled ? undefined : () => handleSubmit(submitPhoneNumber))

  return (
    <PageWithHeader
      title="Numéro de téléphone"
      scrollChildren={
        <ViewGap gap={8}>
          <ViewGap gap={4}>
            <Typo.Title3 {...getHeadingAttrs(2)}>Saisis ton numéro de téléphone</Typo.Title3>
            <Banner label="Ton numéro pourra être utilisé pour recevoir des infos sur tes futures réservations." />
          </ViewGap>
          <Form.MaxWidth>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field, fieldState }) => (
                <ViewGap gap={2}>
                  <TextInput
                    autoComplete="tel"
                    autoCapitalize="none"
                    keyboardType="number-pad"
                    label="Numéro de téléphone"
                    description="Exemple&nbsp;: +33639980123"
                    value={field.value}
                    onChangeText={field.onChange}
                    accessibilityHint={fieldState.error?.message}
                    leftComponent={
                      <Controller
                        name="countryId"
                        control={control}
                        render={({ field }) => {
                          const selectedCountry = findCountry(field.value) ?? METROPOLITAN_FRANCE

                          return (
                            <CountryPicker
                              selectedCountry={selectedCountry}
                              onSelect={(country) => field.onChange(country.id)}
                            />
                          )
                        }}
                      />
                    }
                    testID="Entrée pour le numéro de téléphone"
                    errorMessage={fieldState.error?.message}
                  />
                </ViewGap>
              )}
            />
          </Form.MaxWidth>
        </ViewGap>
      }
      fixedBottomChildren={
        <Button
          type="submit"
          disabled={!formState.isValid}
          wording="Continuer"
          accessibilityLabel="Continuer vers l’étape suivante"
          onPress={handleSubmit(submitPhoneNumber)}
        />
      }
    />
  )
}
