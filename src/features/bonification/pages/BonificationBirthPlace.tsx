import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { INSEE_COUNTRY_LIST, InseeCountry } from 'features/bonification/inseeCountries'
import { BonificationBirthPlaceSchema } from 'features/bonification/schemas/BonificationBirthPlaceSchema'
import {
  legalRepresentativeActions,
  useLegalRepresentative,
} from 'features/bonification/store/legalRepresentativeStore'
import { AddressOption } from 'features/identityCheck/components/AddressOption'
import { SubscriptionStackParamList } from 'features/navigation/SubscriptionStackNavigator/SubscriptionStackTypes'
import { CitySearchInput } from 'features/profile/components/CitySearchInput/CitySearchInput'
import { SuggestedCity } from 'libs/place/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type FormValues = {
  birthCountrySelection: InseeCountry
  birthCountryInput?: string
  birthCity?: SuggestedCity
}

export const BonificationBirthPlace = () => {
  const { navigate } = useNavigation<StackNavigationProp<SubscriptionStackParamList>>()

  const { birthCountry, birthCity } = useLegalRepresentative()
  const { setBirthCountry, setBirthCity } = legalRepresentativeActions

  const [countryList, setCountryList] = useState(
    birthCountry?.LIBCOG
      ? INSEE_COUNTRY_LIST.filter((country) =>
          country.LIBCOG.toLocaleLowerCase().includes(birthCountry?.LIBCOG.toLocaleLowerCase())
        )
      : INSEE_COUNTRY_LIST
  )
  const [showCityField, setShowCityField] = useState(!!birthCity)

  const { control, formState, handleSubmit, reset, watch } = useForm<FormValues>({
    defaultValues: {
      birthCountrySelection: birthCountry ?? undefined,
      birthCity: birthCity ?? undefined,
      birthCountryInput: birthCountry?.LIBCOG ?? undefined,
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
    navigate('BonificationRecap')
  }

  const handleUserInputChange = (input: string) => {
    setCountryList(
      INSEE_COUNTRY_LIST.filter((country) =>
        country.LIBCOG.toLocaleLowerCase().includes(input.toLocaleLowerCase())
      )
    )
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
                      <React.Fragment>
                        <SearchInput
                          onChangeText={(text) => {
                            handleUserInputChange(text)
                            onChangeInput(text)
                          }}
                          value={valueInput}
                          label="Tapes le nom du pays et choisis le pays"
                          format="France"
                          onPressRightIcon={() => {
                            reset()
                            setShowCityField(false)
                          }}
                          keyboardType="default"
                          accessibilityHint={error?.message}
                          testID="Entrée pour le pays de naissance"
                          autoComplete="country"
                          textContentType="countryName"
                          searchInputID="country-name-input"
                          isRequiredField
                        />
                        {valueInput && valueInput.length != 0 ? (
                          <VerticalUl>
                            {countryList.map((country, index) => {
                              return (
                                <Li key={country.COG}>
                                  <AddressOption
                                    label={country.LIBCOG}
                                    selected={country ? country.COG === valueSelection?.COG : false}
                                    onPressOption={() => {
                                      setCountryList([])
                                      onChangeSelection(country)
                                      onChangeInput(country.LIBCOG)
                                      setShowCityField(
                                        watch(
                                          'birthCountrySelection'
                                        )?.LIBCOG?.toLocaleLowerCase() === 'france'
                                      )
                                    }}
                                    optionKey={country.LIBCOG}
                                    accessibilityLabel={`Proposition de pays ${index + 1}\u00a0: ${country.LIBCOG}`}
                                  />
                                </Li>
                              )
                            })}
                          </VerticalUl>
                        ) : null}
                      </React.Fragment>
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
                  <CitySearchInput
                    city={value}
                    onCitySelected={onChange}
                    label="Indique le code postal et choisis la ville"
                    isRequiredField
                  />
                )}
              />
            ) : null}
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
