import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { CountryPicker } from 'features/bonification/components/CountryPicker'
import { InseeCountry } from 'features/bonification/inseeCountries'
import { StyledBodyXsSteps } from 'features/bonification/pages/BonificationNames'
import { BonificationBirthPlaceSchema } from 'features/bonification/schemas/BonificationBirthPlaceSchema'
import {
  legalRepresentativeActions,
  useLegalRepresentative,
} from 'features/bonification/store/legalRepresentativeStore'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { CitySearchNameInput } from 'features/profile/components/CitySearchInput/CitySearchNameInput'
import { env } from 'libs/environment/env'
import { SuggestedCity } from 'libs/place/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryPrimary } from 'ui/components/buttons/ButtonTertiaryPrimary'
import { Form } from 'ui/components/Form'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export type FormValues = {
  birthCountrySelection: InseeCountry
  birthCountryInput?: string
  birthCity?: SuggestedCity
}

export const BonificationBirthPlace = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  const { birthCountry, birthCity } = useLegalRepresentative()
  const { setBirthCountry, setBirthCity } = legalRepresentativeActions

  const [showCityField, setShowCityField] = useState(!!birthCity)

  const { control, formState, handleSubmit, reset, watch } = useForm<FormValues>({
    defaultValues: {
      birthCountrySelection: birthCountry ?? {},
      birthCity: birthCity ?? {},
      birthCountryInput: birthCountry?.LIBCOG ?? '',
    },
    resolver: yupResolver(BonificationBirthPlaceSchema),
    mode: 'onChange',
  })

  const disabled = !formState.isValid

  async function saveBirthPlaceAndNavigate({ birthCountrySelection, birthCity }: FormValues) {
    if (disabled) return
    setBirthCountry(birthCountrySelection)
    if (birthCountrySelection.LIBCOG === 'France' && birthCity) {
      setBirthCity(birthCity)
    } else {
      setBirthCity(null)
    }
    navigate(...getSubscriptionHookConfig('BonificationRecap'))
  }

  useEnterKeyAction(disabled ? undefined : () => handleSubmit(saveBirthPlaceAndNavigate))

  return (
    <PageWithHeader
      title="Informations"
      scrollChildren={
        <Form.MaxWidth>
          <StyledBodyXsSteps>Étape 4 sur 5</StyledBodyXsSteps>
          <ViewGap gap={4}>
            <Typo.Title3 {...getHeadingAttrs(2)}>
              Quel est le lieu de naissance de ton représentant légal&nbsp;?
            </Typo.Title3>
            <Controller
              control={control}
              name="birthCountrySelection"
              render={({ field: { onChange: onChangeSelection, value: valueSelection } }) => (
                <Controller
                  control={control}
                  name="birthCountryInput"
                  render={({
                    field: { value: valueInput, onChange: onChangeInput },
                    fieldState: { error },
                  }) => {
                    return (
                      <CountryPicker
                        error={error}
                        birthCountry={birthCountry}
                        onChangeInput={onChangeInput}
                        onChangeSelection={onChangeSelection}
                        reset={reset}
                        setShowCityField={setShowCityField}
                        valueInput={valueInput}
                        valueSelection={valueSelection}
                        watch={watch}
                      />
                    )
                  }}
                />
              )}
            />
            {showCityField ? (
              <Controller
                control={control}
                name="birthCity"
                render={({ field: { value, onChange } }) => (
                  <CitySearchNameInput
                    city={value}
                    onCitySelected={onChange}
                    label="Commune de naissance"
                    requiredIndicator="explicit"
                  />
                )}
              />
            ) : null}
            <ButtonTertiaryPrimary
              numberOfLines={2}
              icon={InfoPlain}
              wording="Je ne connais pas son lieu de naissance"
              onPress={async () => {
                await openUrl(env.FAQ_BONIFICATION)
              }}
              justifyContent="flex-start"
              inline
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
