import { yupResolver } from '@hookform/resolvers/yup'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import styled from 'styled-components/native'
import * as yup from 'yup'

import {
  COUNTRIES,
  METROPOLITAN_FRANCE,
} from 'features/identityCheck/components/countryPicker/constants'
import { CountryPicker } from 'features/identityCheck/components/countryPicker/CountryPicker'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { useNavigateForwardToStepper } from 'features/identityCheck/helpers/useNavigateForwardToStepper'
import { useSaveStep } from 'features/identityCheck/pages/helpers/useSaveStep'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { analytics } from 'libs/analytics'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { InputError } from 'ui/components/inputs/InputError'
import { TextInput } from 'ui/components/inputs/TextInput'
import { Info } from 'ui/svg/icons/Info'
import { getSpacing, TypoDS } from 'ui/theme'

import { invalidateStepperInfoQuery } from '../helpers/invalidateStepperQuery'

const phoneRegex = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/
const schema = yup.object({
  phoneNumber: yup
    .string()
    .required('Le numéro de téléphone est requis')
    .matches(phoneRegex, 'Le numéro de téléphone est invalide'),
  countryId: yup.string().required(),
})

type FormValues = yup.InferType<typeof schema>

const findCountry = (countryId: string) => COUNTRIES.find((country) => country.id === countryId)

export const SetPhoneNumberWithoutValidation = () => {
  const { dispatch, phoneValidation } = useSubscriptionContext()
  const { control, handleSubmit } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      phoneNumber: phoneValidation?.phoneNumber,
      countryId: phoneValidation?.country.countryCode ?? METROPOLITAN_FRANCE.id,
    },
  })

  const { navigateForwardToStepper } = useNavigateForwardToStepper()
  const saveStep = useSaveStep()

  const onSubmit = ({ phoneNumber, countryId }: FormValues) => {
    const country = findCountry(countryId)
    if (!country) {
      return
    }
    dispatch({
      type: 'SET_PHONE_NUMBER',
      payload: {
        phoneNumber,
        country: {
          countryCode: country.id,
          callingCode: country.callingCode,
        },
      },
    })
    saveStep(IdentityCheckStep.PHONE_VALIDATION)
    invalidateStepperInfoQuery()
    navigateForwardToStepper()
  }

  const submit = handleSubmit(onSubmit)

  useEffect(() => {
    analytics.logScreenViewSetPhoneNumber()
  }, [])

  return (
    <PageWithHeader
      title="Numéro de téléphone"
      scrollChildren={
        <Container>
          <HeaderContainer>
            <TypoDS.Title3>Saisis ton numéro de téléphone</TypoDS.Title3>
            <InfoBanner
              icon={Info}
              message="Ton numéro pourra être utilisé pour recevoir des infos sur tes futures réservations."
            />
          </HeaderContainer>
          <Form.MaxWidth>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field, fieldState }) => (
                <InputContainer>
                  <TextInput
                    autoComplete="off" // disable autofill on android
                    autoCapitalize="none"
                    isError={false}
                    keyboardType="number-pad"
                    label="Numéro de téléphone"
                    value={field.value}
                    onChangeText={field.onChange}
                    onSubmitEditing={submit}
                    textContentType="none" // disable autofill on iOS
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
                  />
                  <InputError
                    visible={!!fieldState.error}
                    messageId={fieldState.error?.message}
                    numberOfSpacesTop={0}
                  />
                </InputContainer>
              )}
            />
          </Form.MaxWidth>
        </Container>
      }
      fixedBottomChildren={<ButtonPrimary type="submit" wording="Continuer" onPress={submit} />}
    />
  )
}

const HeaderContainer = styled.View({
  gap: getSpacing(4),
})

const Container = styled.View({
  gap: getSpacing(8),
})

const InputContainer = styled.View({
  gap: getSpacing(2),
})
