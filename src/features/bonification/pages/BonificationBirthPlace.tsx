/* eslint-disable react-native/no-inline-styles */
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Insets, Text, TouchableOpacity, View } from 'react-native'

import { INSEE_COUNTRY_LIST } from 'features/bonification/inseeCountries'
import { BonificationBirthPlaceSchema } from 'features/bonification/schemas/BonificationBirthPlaceSchema'
import {
  legalRepresentativeActions,
  useLegalRepresentative,
} from 'features/bonification/store/legalRepresentativeStore'
import { SubscriptionStackParamList } from 'features/navigation/SubscriptionStackNavigator/SubscriptionStackTypes'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { InputText } from 'ui/designSystem/InputText/InputText'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { Validate } from 'ui/svg/icons/Validate'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type FormValues = {
  birthCountrySelection: string
  birthCountryInput?: string
  birthCity?: string
}
const inset = 10 // arbitrary hitSlop zone inset for touchable
const hitSlop: Insets = { top: inset, right: inset, bottom: inset, left: inset }

export const BonificationBirthPlace = () => {
  const { navigate } = useNavigation<StackNavigationProp<SubscriptionStackParamList>>()

  const storedLegalRepresentative = useLegalRepresentative()
  const { setBirthCountry, setBirthCity } = legalRepresentativeActions

  const [countryList, setCountryList] = useState(INSEE_COUNTRY_LIST)
  const [showCityField, setShowCityField] = useState(!!storedLegalRepresentative.birthCity)

  const { control, formState, handleSubmit, reset, watch } = useForm<FormValues>({
    defaultValues: {
      birthCountrySelection: storedLegalRepresentative.birthCountry ?? '',
      birthCity: storedLegalRepresentative.birthCity ?? '',
      birthCountryInput: '',
    },
    resolver: yupResolver(BonificationBirthPlaceSchema),
    mode: 'onChange',
  })

  const disabled = !formState.isValid

  async function saveBirthPlaceAndNavigate({ birthCountrySelection, birthCity }: FormValues) {
    if (disabled) return
    // eslint-disable-next-line no-console
    console.log({ birthCountrySelection, birthCity })
    setBirthCountry(birthCountrySelection)
    if (birthCountrySelection !== 'France' && birthCity) setBirthCity(birthCity)
    navigate('BonificationRecap')
  }

  const handleUserInputChange = (input: string) => {
    setCountryList(
      INSEE_COUNTRY_LIST.filter((country) =>
        country.LIBCOG.toLocaleLowerCase().startsWith(input.toLocaleLowerCase())
      )
    )
  }

  // console.log('Input', watch('birthCountryInput'))
  // console.log('Selection', watch('birthCountrySelection'))

  useEnterKeyAction(disabled ? undefined : () => handleSubmit(saveBirthPlaceAndNavigate))

  const findCountry = (countryName) => {
    return INSEE_COUNTRY_LIST.find(
      (country) => country.LIBCOG.toLocaleLowerCase() === countryName.toLocaleLowerCase()
    )
  }

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
              render={({
                field: { onChange: onChangeSelection, value: valueSelection },
                fieldState: { error },
              }) => (
                <React.Fragment>
                  <Controller
                    control={control}
                    name="birthCountryInput"
                    render={({
                      field: { value: valueInput, onChange: onChangeInput },
                      fieldState: { error },
                    }) => (
                      <React.Fragment>
                        <InputText
                          label="Pays de naissance"
                          value={valueInput}
                          autoFocus
                          onChangeText={(text) => {
                            handleUserInputChange(text)
                            onChangeInput(text)
                          }}
                          requiredIndicator="explicit"
                          accessibilityHint={error?.message}
                          testID="Entrée pour le pays de naissance"
                          textContentType="countryName"
                          autoComplete="country"
                          errorMessage={error?.message}
                        />
                        <View style={{ flexDirection: 'row' }}>
                          <Text>Selected country: {valueSelection}</Text>
                          <Validate />
                          {valueInput && valueInput.length != 0 ? (
                            <Touchable
                              hitSlop={hitSlop}
                              onPress={() => {
                                reset()
                                setShowCityField(false)
                              }}
                              accessibilityLabel="Réinitialiser la recherche"
                              type="reset">
                              <Invalidate />
                            </Touchable>
                          ) : null}
                        </View>
                        {valueInput &&
                          valueInput.length != 0 &&
                          countryList.map((country) => {
                            return (
                              <TouchableOpacity
                                key={country.COG}
                                onPress={() => {
                                  setCountryList([])
                                  onChangeSelection(country.LIBCOG)
                                  onChangeInput(country.LIBCOG)
                                  if (
                                    watch('birthCountrySelection').toLocaleLowerCase() === 'france'
                                  ) {
                                    setShowCityField(true)
                                  } else setShowCityField(false)
                                }}>
                                <View style={{ flexDirection: 'row' }}>
                                  <Text>{country.LIBCOG}</Text>
                                  {valueSelection === country.LIBCOG ? <Validate /> : null}
                                </View>
                              </TouchableOpacity>
                            )
                          })}
                      </React.Fragment>
                    )}
                  />
                </React.Fragment>
              )}
            />
            {showCityField ? (
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
