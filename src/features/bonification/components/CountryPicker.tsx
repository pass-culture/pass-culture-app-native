import React, { useState } from 'react'
import { FieldError, UseFormReset, UseFormWatch } from 'react-hook-form'
import { View } from 'react-native'

import { InseeCountry } from 'api/gen'
import { useCountriesQuery } from 'features/bonification/queries/useCountriesQuery'
import { AddressOption } from 'features/identityCheck/components/AddressOption'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { SearchInput } from 'ui/designSystem/SearchInput/SearchInput'

import { FormValues } from '../pages/BonificationBirthPlace'

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
  const { data } = useCountriesQuery()
  const [countryList, setCountryList] = useState(
    birthCountry?.libcog
      ? data?.countries?.filter((country) =>
          country.libcog.toLocaleLowerCase().includes(birthCountry?.libcog.toLocaleLowerCase())
        )
      : data?.countries
  )

  const handleUserInputChange = (input: string) => {
    setCountryList(
      data?.countries?.filter((country) =>
        country.libcog.toLocaleLowerCase().includes(input.toLocaleLowerCase())
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
        description="Exemple&nbsp;: France"
        onClear={() => {
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
        requiredIndicator="explicit"
      />
      {valueInput && valueInput.length != 0 ? (
        <VerticalUl>
          {countryList?.map((country, index) => {
            return (
              <Li key={country.cog}>
                <AddressOption
                  label={country.libcog}
                  selected={country ? country.cog === valueSelection?.cog : false}
                  onPressOption={() => {
                    setCountryList([])
                    onChangeSelection(country)
                    onChangeInput(country.libcog)
                    setShowCityField(
                      watch('birthCountrySelection')?.libcog?.toLocaleLowerCase() === 'france'
                    )
                  }}
                  optionKey={country.libcog}
                  accessibilityLabel={`Proposition de pays ${index + 1}\u00a0: ${country.libcog}`}
                />
              </Li>
            )
          })}
        </VerticalUl>
      ) : null}
    </View>
  )
}
