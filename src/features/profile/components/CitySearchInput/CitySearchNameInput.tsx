import { yupResolver } from '@hookform/resolvers/yup'
import { debounce } from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard, Platform } from 'react-native'
import styled from 'styled-components/native'
import { object, string } from 'yup'

import { AddressOption } from 'features/identityCheck/components/AddressOption'
import { IdentityCheckError } from 'features/identityCheck/pages/profile/errors'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { eventMonitoring } from 'libs/monitoring/services'
import { useCitiesByNameQuery } from 'libs/place/queries/useCitiesByNameQuery'
import { SuggestedCity } from 'libs/place/types'
import { Form } from 'ui/components/Form'
import { InputError } from 'ui/components/inputs/InputError'
import { RequiredIndicator } from 'ui/components/inputs/types'
import { Li } from 'ui/components/Li'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Spinner } from 'ui/components/Spinner'
import { VerticalUl } from 'ui/components/Ul'
import { SearchInput } from 'ui/designSystem/SearchInput/SearchInput'

const keyExtractor = ({ name, departementCode }: SuggestedCity) => `${name}-${departementCode}`

type CitySearchInputProps = {
  city?: SuggestedCity
  onCitySelected?: (city?: SuggestedCity) => void
  label?: string
  requiredIndicator?: RequiredIndicator
}

type CityNameForm = { cityName: string }

export const CitySearchNameInput = ({
  city,
  onCitySelected,
  label,
  requiredIndicator,
}: CitySearchInputProps) => {
  const { showErrorSnackBar } = useSnackBarContext()
  const [cityNameQuery, setCityNameQuery] = useState<string>(city?.name ?? '')
  const debouncedSetCityName = useRef(debounce(setCityNameQuery, 500)).current
  const { data: cities = [], isLoading, isError, isSuccess } = useCitiesByNameQuery(cityNameQuery)

  const {
    control,
    handleSubmit,
    watch,
    setError,
    reset: resetForm,
  } = useForm<CityNameForm>({
    resolver: yupResolver(object().shape({ cityName: string() })),
    defaultValues: { cityName: city?.name ?? '' },
  })

  useEffect(() => {
    if (isSuccess) {
      const isEmpty = cities.length === 0
      if (isEmpty)
        setError('cityName', {
          message: 'Cette ville est introuvable. Vérifie l’orthographe.',
        })
    }
    if (isError) {
      showErrorSnackBar({
        message: 'Nous avons eu un problème pour trouver la ville. Réessaie plus tard.',
        timeout: SNACK_BAR_TIME_OUT,
      })
      eventMonitoring.captureException(
        new IdentityCheckError('Failed to fetch data from API: https://geo.api.gouv.fr/communes')
      )
    }
  }, [isSuccess, isError, cities.length, setError, showErrorSnackBar])

  const onSubmit = useCallback(
    ({ cityName }: CityNameForm) => {
      onCitySelected?.()
      debouncedSetCityName(cityName)
    },
    [debouncedSetCityName, onCitySelected]
  )

  const handleCityNameChange = (cityName: string) => {
    setCityNameQuery(cityName)
  }

  useEffect(() => {
    const subscription = watch(() => handleSubmit(onSubmit)())
    return () => subscription.unsubscribe()
  }, [onSubmit, handleSubmit, watch])

  const onPressOption = (cityKey: string) => {
    const city = cities.find(
      (suggestedCity: SuggestedCity) => keyExtractor(suggestedCity) === cityKey
    )
    onCitySelected?.(city)
    Keyboard.dismiss()
  }

  const resetSearch = () => {
    resetForm({ cityName: '' })
    setCityNameQuery('')
    onCitySelected?.()
  }

  return (
    <React.Fragment>
      <Form.MaxWidth>
        <Controller
          control={control}
          name="cityName"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <StyledView>
              <SearchInput
                onChangeText={(text) => {
                  onChange(text)
                  handleCityNameChange(text)
                }}
                value={value}
                label={label ?? 'Indique le nom de la ville'}
                description="Exemple&nbsp;: Paris"
                onClear={resetSearch}
                keyboardType="default"
                accessibilityHint={error?.message}
                testID="Entrée pour la ville"
                autoComplete="postal-address-locality"
                requiredIndicator={requiredIndicator}
              />
              <InputError errorMessage={error?.message} numberOfSpacesTop={2} visible={!!error} />
            </StyledView>
          )}
        />
      </Form.MaxWidth>

      <React.Fragment>
        {isLoading ? <Spinner /> : null}
        <CitiesContainer accessibilityRole={AccessibilityRole.RADIOGROUP}>
          <VerticalUl>
            {cities.map((cityOption, index) => {
              const cityLabel = `${cityOption.name} (${cityOption.departementCode})`
              return (
                <Li key={cityLabel}>
                  <AddressOption
                    label={cityLabel}
                    selected={city ? keyExtractor(cityOption) === keyExtractor(city) : false}
                    onPressOption={onPressOption}
                    optionKey={keyExtractor(cityOption)}
                    accessibilityLabel={`Proposition de ville ${index + 1}\u00a0: ${cityLabel}`}
                  />
                </Li>
              )
            })}
          </VerticalUl>
        </CitiesContainer>
      </React.Fragment>
    </React.Fragment>
  )
}

const CitiesContainer = styled.View({
  flexGrow: 1,
  overflowY: 'scroll',
  ...(Platform.OS === 'web' ? { boxSizing: 'content-box' } : {}),
})

const StyledView = styled.View(({ theme }) => ({ marginBottom: theme.designSystem.size.spacing.s }))
