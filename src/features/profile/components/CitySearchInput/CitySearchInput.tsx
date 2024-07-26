import { yupResolver } from '@hookform/resolvers/yup'
import debounce from 'lodash/debounce'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard, Platform } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'
import { object, string } from 'yup'

import { AddressOption } from 'features/identityCheck/components/AddressOption'
import { CenteredTitle } from 'features/identityCheck/components/CenteredTitle'
import { IdentityCheckError } from 'features/identityCheck/pages/profile/errors'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { eventMonitoring } from 'libs/monitoring'
import { SuggestedCity } from 'libs/place/types'
import { useCities } from 'libs/place/useCities'
import { Form } from 'ui/components/Form'
import { InputError } from 'ui/components/inputs/InputError'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { Li } from 'ui/components/Li'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Spinner } from 'ui/components/Spinner'
import { VerticalUl } from 'ui/components/Ul'
import { Spacer } from 'ui/theme'

const snackbarMessage =
  'Nous avons eu un problème pour trouver la ville associée à ton code postal. Réessaie plus tard.'
const exceptionMessage = 'Failed to fetch data from API: https://geo.api.gouv.fr/communes'
const noPostalCodeFound =
  'Ce code postal est introuvable. Réessaye un autre code postal ou renseigne un arrondissement (ex: 75001).'

const keyExtractor = ({ name, code, postalCode }: SuggestedCity) => `${name}-${code}-${postalCode}`

type CitySearchInputProps = {
  city?: SuggestedCity
  onCitySelected: (city?: SuggestedCity) => void
}

type PostalCodeForm = { postalCode: string }

export const CitySearchInput = ({ city, onCitySelected }: CitySearchInputProps) => {
  const { showErrorSnackBar } = useSnackBarContext()
  const [postalCodeQuery, setPostalCodeQuery] = useState<string>(city?.postalCode ?? '')
  const debouncedSetPostalCode = useRef(debounce(setPostalCodeQuery, 500)).current
  const { data: cities = [], isLoading } = useCities(postalCodeQuery, {
    onError: () => {
      showErrorSnackBar({ message: snackbarMessage, timeout: SNACK_BAR_TIME_OUT })
      eventMonitoring.captureException(new IdentityCheckError(exceptionMessage))
    },
    onSuccess: (cities) => {
      const isEmpty = cities.length === 0
      if (isEmpty) setError('postalCode', { message: noPostalCodeFound })
    },
  })
  const postalCodeInputId = uuidv4()

  const {
    control,
    handleSubmit,
    watch,
    setError,
    reset: resetForm,
  } = useForm<PostalCodeForm>({
    resolver: yupResolver(object().shape({ postalCode: string() })),
    defaultValues: { postalCode: city?.postalCode ?? '' },
  })

  const onSubmit = useCallback(
    ({ postalCode }: PostalCodeForm) => {
      onCitySelected()
      debouncedSetPostalCode(postalCode)
    },
    [debouncedSetPostalCode, onCitySelected]
  )

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
    resetForm()
    setPostalCodeQuery('')
    onCitySelected?.()
  }

  return (
    <React.Fragment>
      <Form.MaxWidth>
        <CenteredTitle title="Dans quelle ville résides-tu&nbsp;?" />
        <Spacer.Column numberOfSpaces={5} />

        <Controller
          control={control}
          name="postalCode"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <React.Fragment>
              <SearchInput
                autoFocus
                onChangeText={onChange}
                value={value}
                label="Indique ton code postal et choisis ta ville"
                placeholder="Ex&nbsp;: 75017"
                textContentType="postalCode"
                onPressRightIcon={resetSearch}
                keyboardType="number-pad"
                accessibilityDescribedBy={postalCodeInputId}
                testID="Entrée pour la ville"
              />
              <InputError
                messageId={error?.message}
                numberOfSpacesTop={2}
                visible={!!error}
                relatedInputId={postalCodeInputId}
              />
            </React.Fragment>
          )}
        />
        <Spacer.Column numberOfSpaces={2} />
      </Form.MaxWidth>
      {isLoading ? <Spinner /> : null}
      <CitiesContainer accessibilityRole={AccessibilityRole.RADIOGROUP}>
        <VerticalUl>
          {cities.map((cityOption, index) => (
            <Li key={cityOption.name}>
              <AddressOption
                label={cityOption.name}
                selected={city ? keyExtractor(cityOption) === keyExtractor(city) : false}
                onPressOption={onPressOption}
                optionKey={keyExtractor(cityOption)}
                accessibilityLabel={`Proposition de ville ${index + 1}\u00a0: ${cityOption.name}`}
              />
            </Li>
          ))}
        </VerticalUl>
      </CitiesContainer>
    </React.Fragment>
  )
}

const CitiesContainer = styled.View({
  flexGrow: 1,
  overflowY: 'scroll',
  ...(Platform.OS === 'web' ? { boxSizing: 'content-box' } : {}),
})
