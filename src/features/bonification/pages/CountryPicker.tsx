import React, { useState } from 'react'
import { FieldError, UseFormReset, UseFormWatch } from 'react-hook-form'
import { View } from 'react-native'

import { INSEE_COUNTRY_LIST, InseeCountry } from 'features/bonification/inseeCountries'
import { AddressOption } from 'features/identityCheck/components/AddressOption'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'

import { FormValues } from './BonificationBirthPlace'

export const CountryPicker: React.FC<{
  error: FieldError | undefined
  birthCountry: InseeCountry | null
  onChangeInput: (...event: unknown[]) => void
  onChangeSelection: (...event: unknown[]) => void
  reset: UseFormReset<FormValues>
  setShowCityField: React.Dispatch<React.SetStateAction<boolean>>
  valueInput: string | undefined
  valueSelection: InseeCountry
  watch: UseFormWatch<FormValues>
}> = ({
  error,
  birthCountry,
  onChangeInput,
  onChangeSelection,
  reset,
  setShowCityField,
  valueInput,
  valueSelection,
  watch,
}) => {
  const [countryList, setCountryList] = useState(
    birthCountry?.LIBCOG
      ? INSEE_COUNTRY_LIST.filter((country) =>
          country.LIBCOG.toLocaleLowerCase().includes(birthCountry?.LIBCOG.toLocaleLowerCase())
        )
      : INSEE_COUNTRY_LIST
  )

  const handleUserInputChange = (input: string) => {
    setCountryList(
      INSEE_COUNTRY_LIST.filter((country) =>
        country.LIBCOG.toLocaleLowerCase().includes(input.toLocaleLowerCase())
      )
    )
  }
  return (
    <View>
      <SearchInput
        onChangeText={(text) => {
          handleUserInputChange(text)
          onChangeInput(text)
        }}
        value={valueInput}
        label="Pays de naissance"
        format="France"
        onPressRightIcon={() => {
          reset({
            birthCountrySelection: {},
            birthCity: {},
            birthCountryInput: '',
          }) // strange that I have to specify empty values (or else resets to store values if present)
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
                      watch('birthCountrySelection')?.LIBCOG?.toLocaleLowerCase() === 'france'
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
    </View>
  )
}
