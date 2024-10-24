import { yupResolver } from '@hookform/resolvers/yup'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
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
import { useUpdateProfileMutation } from 'features/profile/api/useUpdateProfileMutation'
import { analytics } from 'libs/analytics'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { InputError } from 'ui/components/inputs/InputError'
import { TextInput } from 'ui/components/inputs/TextInput'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Info } from 'ui/svg/icons/Info'
import { TypoDS } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

import { invalidateStepperInfoQuery } from '../helpers/invalidateStepperQuery'

import { formatPhoneNumberWithPrefix } from './helpers/formatPhoneNumber'

const schema = yup.object({
  phoneNumber: yup.string().required('Le numéro de téléphone est requis'),
  countryId: yup.string().required(),
})

type FormValues = yup.InferType<typeof schema>

const findCountry = (countryId: string) => COUNTRIES.find((country) => country.id === countryId)

export const SetPhoneNumberWithoutValidation = () => {
  const phoneNumberInputErrorId = uuidv4()
  const { dispatch, phoneValidation } = useSubscriptionContext()
  const { control, handleSubmit, getValues, setError, formState } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      phoneNumber: phoneValidation?.phoneNumber,
      countryId: phoneValidation?.country.countryCode ?? METROPOLITAN_FRANCE.id,
    },
    mode: 'onChange',
  })

  const disableSubmit = !formState.isValid

  const { navigateForwardToStepper } = useNavigateForwardToStepper()
  const saveStep = useSaveStep()
  const { mutate: updateProfile } = useUpdateProfileMutation(
    () => {
      const { phoneNumber, countryId } = getValues()
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
    },
    () => {
      setError('phoneNumber', { message: 'Une erreur est survenue' })
    }
  )

  const onSubmit = async ({ phoneNumber, countryId }: FormValues) => {
    const country = findCountry(countryId)
    if (!country) {
      return
    }
    const phoneNumberWithPrefix = formatPhoneNumberWithPrefix(phoneNumber, country.callingCode)
    updateProfile({ phoneNumber: phoneNumberWithPrefix })
  }

  const submit = handleSubmit(onSubmit)

  useEffect(() => {
    analytics.logScreenViewSetPhoneNumber()
  }, [])

  return (
    <PageWithHeader
      title="Numéro de téléphone"
      scrollChildren={
        <ViewGap gap={8}>
          <ViewGap gap={4}>
            <TypoDS.Title3 {...getHeadingAttrs(2)}>Saisis ton numéro de téléphone</TypoDS.Title3>
            <InfoBanner
              icon={Info}
              message="Ton numéro pourra être utilisé pour recevoir des infos sur tes futures réservations."
            />
          </ViewGap>
          <Form.MaxWidth>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field, fieldState }) => (
                <ViewGap gap={2}>
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
                    accessibilityDescribedBy={phoneNumberInputErrorId}
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
                    relatedInputId={phoneNumberInputErrorId}
                  />
                </ViewGap>
              )}
            />
          </Form.MaxWidth>
        </ViewGap>
      }
      fixedBottomChildren={
        <ButtonPrimary
          disabled={disableSubmit}
          type="submit"
          wording="Continuer"
          onPress={submit}
        />
      }
    />
  )
}
