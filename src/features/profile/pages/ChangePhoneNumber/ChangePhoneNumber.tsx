import React from 'react'
import { Controller } from 'react-hook-form'

import { METROPOLITAN_FRANCE } from 'features/identityCheck/components/countryPicker/constants'
import { CountryPicker } from 'features/identityCheck/components/countryPicker/CountryPicker'
import { findCountry } from 'features/identityCheck/pages/phoneValidation/helpers/findCountry'
import { useSubmitChangePhoneNumber } from 'features/profile/pages/ChangePhoneNumber/useSubmitChangePhoneNumber'
import { Form } from 'ui/components/Form'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { TextInput } from 'ui/designSystem/TextInput/TextInput'
import { PageWithHeader } from 'ui/pages/PageWithHeader'

export function ChangePhoneNumber() {
  const { control, handleSubmit, onSubmit, isValid, buttonWording, isPending } =
    useSubmitChangePhoneNumber()

  return (
    <PageWithHeader
      title="Modifier mon numéro de téléphone"
      scrollViewProps={{
        keyboardShouldPersistTaps: 'handled',
      }}
      scrollChildren={
        <Form.MaxWidth flex={1}>
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
      }
      fixedBottomChildren={
        <Button
          type="submit"
          onPress={handleSubmit(onSubmit)}
          wording={buttonWording}
          disabled={!isValid}
          isLoading={isPending}
        />
      }
    />
  )
}
