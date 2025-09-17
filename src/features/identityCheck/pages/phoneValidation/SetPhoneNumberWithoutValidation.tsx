import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import { isApiError } from 'api/apiHelpers'
import { METROPOLITAN_FRANCE } from 'features/identityCheck/components/countryPicker/constants'
import { CountryPicker } from 'features/identityCheck/components/countryPicker/CountryPicker'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { useNavigateForwardToStepper } from 'features/identityCheck/helpers/useNavigateForwardToStepper'
import { invalidateStepperInfoQueries } from 'features/identityCheck/pages/helpers/invalidateStepperQueries'
import { useSaveStep } from 'features/identityCheck/pages/helpers/useSaveStep'
import { findCountry } from 'features/identityCheck/pages/phoneValidation/helpers/findCountry'
import { formatPhoneNumberWithPrefix } from 'features/identityCheck/pages/phoneValidation/helpers/formatPhoneNumber'
import {
  PhoneNumberFormValues,
  phoneNumberSchema,
} from 'features/identityCheck/pages/phoneValidation/helpers/phoneNumberSchema'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { usePatchProfileMutation } from 'queries/profile/usePatchProfileMutation'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { InputText } from 'ui/designSystem/InputText/InputText'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Info } from 'ui/svg/icons/Info'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const SetPhoneNumberWithoutValidation = () => {
  const { dispatch, phoneValidation } = useSubscriptionContext()
  const { control, handleSubmit, getValues, setError, formState } = useForm<PhoneNumberFormValues>({
    resolver: yupResolver(phoneNumberSchema),
    defaultValues: {
      phoneNumber: phoneValidation?.phoneNumber,
      countryId: phoneValidation?.country.countryCode ?? METROPOLITAN_FRANCE.id,
    },
    mode: 'onChange',
  })

  const { navigateForwardToStepper } = useNavigateForwardToStepper()
  const saveStep = useSaveStep()
  const { mutate: patchProfile } = usePatchProfileMutation({
    onSuccess: () => {
      const { phoneNumber, countryId } = getValues()
      const country = findCountry(countryId)
      if (!country) return

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
      invalidateStepperInfoQueries()
      navigateForwardToStepper()
    },
    onError: (error) => {
      isApiError(error) && setError('phoneNumber', { message: error.message })
    },
  })

  const onSubmit = async ({ phoneNumber, countryId }: PhoneNumberFormValues) => {
    const country = findCountry(countryId)
    if (!country) {
      return
    }
    const phoneNumberWithPrefix = formatPhoneNumberWithPrefix(phoneNumber, country.callingCode)
    patchProfile({ phoneNumber: phoneNumberWithPrefix })
  }

  const submit = handleSubmit(onSubmit)

  return (
    <PageWithHeader
      title="Numéro de téléphone"
      scrollChildren={
        <ViewGap gap={8}>
          <ViewGap gap={4}>
            <Typo.Title3 {...getHeadingAttrs(2)}>Saisis ton numéro de téléphone</Typo.Title3>
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
                  <InputText
                    autoComplete="tel"
                    autoCapitalize="none"
                    keyboardType="number-pad"
                    label="Numéro de téléphone"
                    format="0639980123"
                    value={field.value}
                    onChangeText={field.onChange}
                    onSubmitEditing={submit}
                    textContentType="telephoneNumber"
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
        <ButtonPrimary
          disabled={!formState.isValid}
          type="submit"
          wording="Continuer"
          accessibilityLabel="Continuer vers l’étape suivante"
          onPress={submit}
        />
      }
    />
  )
}
