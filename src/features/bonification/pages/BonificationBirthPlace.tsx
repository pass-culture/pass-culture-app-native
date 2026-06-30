import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { InseeCountry } from 'api/gen'
import { CountryPicker } from 'features/bonification/components/CountryPicker'
import { BonificationType } from 'features/bonification/enums'
import { StyledBodyXsSteps } from 'features/bonification/pages/BonificationNames'
import { BonificationBirthPlaceSchema } from 'features/bonification/schemas/BonificationBirthPlaceSchema'
import {
  legalRepresentativeActions,
  useLegalRepresentative,
} from 'features/bonification/store/legalRepresentativeStore'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { UseNavigationType, UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/navigators/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { CitySearchNameInput } from 'features/profile/components/CitySearchInput/CitySearchNameInput'
import { env } from 'libs/environment/env'
import { SuggestedCity } from 'libs/place/types'
import { Form } from 'ui/components/Form'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
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
  const { params } = useRoute<UseRouteType<'BonificationBirthPlace'>>()
  const { navigate } = useNavigation<UseNavigationType>()
  const isDisabilityBonification = params?.bonificationType === BonificationType.DISABILITY

  const title = isDisabilityBonification
    ? 'Quel est ton lieu de naissance\u00a0?'
    : 'Quel est le lieu de naissance de ton représentant légal\u00a0?'

  const step = isDisabilityBonification ? 'Étape 1 sur 2' : 'Étape 4 sur 5'

  const { birthCountry, birthCity } = useLegalRepresentative()
  const { setBirthCountry, setBirthCity } = legalRepresentativeActions

  const [showCityField, setShowCityField] = useState(!!birthCity)

  const { control, formState, handleSubmit, reset, watch } = useForm<FormValues>({
    defaultValues: {
      birthCountrySelection: birthCountry ?? {},
      birthCity: birthCity ?? {},
      birthCountryInput: birthCountry?.libcog ?? '',
    },
    resolver: yupResolver(BonificationBirthPlaceSchema),
    mode: 'onChange',
  })

  const disabled = !formState.isValid

  const saveBirthPlaceAndNavigate = ({ birthCountrySelection, birthCity }: FormValues) => {
    if (disabled) return
    setBirthCountry(birthCountrySelection)
    if (birthCountrySelection.libcog === 'France' && birthCity) {
      setBirthCity(birthCity)
    } else {
      setBirthCity(null)
    }

    navigate(
      ...getSubscriptionHookConfig('BonificationRecap', {
        bonificationType: params?.bonificationType ?? BonificationType.FAMILY_QUOTIENT,
      })
    )
  }

  useEnterKeyAction(disabled ? undefined : () => handleSubmit(saveBirthPlaceAndNavigate))

  return (
    <PageWithHeader
      title="Informations"
      scrollChildren={
        <Form.MaxWidth>
          <StyledBodyXsSteps>{step}</StyledBodyXsSteps>
          <ViewGap gap={4}>
            <Typo.Title3 {...getHeadingAttrs(2)}>{title}</Typo.Title3>
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
            {isDisabilityBonification ? null : (
              <Button
                variant="tertiary"
                numberOfLines={2}
                icon={InfoPlain}
                wording="Je ne connais pas son lieu de naissance"
                onPress={async () => {
                  await openUrl(env.FAQ_BONIFICATION_LEGAL_GUARDIAN_BIRTH_INFORMATIONS)
                }}
              />
            )}
          </ViewGap>
        </Form.MaxWidth>
      }
      fixedBottomChildren={
        <Button
          wording="Continuer"
          type="submit"
          accessibilityLabel="Continuer vers le résumé"
          onPress={handleSubmit(saveBirthPlaceAndNavigate)}
          disabled={disabled}
        />
      }
    />
  )
}
