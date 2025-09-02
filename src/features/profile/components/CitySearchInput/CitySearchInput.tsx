import { yupResolver } from '@hookform/resolvers/yup'
import { debounce } from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard, Platform } from 'react-native'
import styled from 'styled-components/native'
import { object, string } from 'yup'

import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { AddressOption } from 'features/identityCheck/components/AddressOption'
import { IdentityCheckError } from 'features/identityCheck/pages/profile/errors'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { eventMonitoring } from 'libs/monitoring/services'
import { SuggestedCity } from 'libs/place/types'
import { useCities } from 'libs/place/useCities'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { Form } from 'ui/components/Form'
import { InputError } from 'ui/components/inputs/InputError'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { Li } from 'ui/components/Li'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Spinner } from 'ui/components/Spinner'
import { VerticalUl } from 'ui/components/Ul'
import { Error } from 'ui/svg/icons/Error'
import { getSpacing } from 'ui/theme'

const keyExtractor = ({ name, code, postalCode }: SuggestedCity) => `${name}-${code}-${postalCode}`

type CitySearchInputProps = {
  city?: SuggestedCity
  onCitySelected?: (city?: SuggestedCity) => void
}

type PostalCodeForm = { postalCode: string }

export const CitySearchInput = ({ city, onCitySelected }: CitySearchInputProps) => {
  const { showErrorSnackBar } = useSnackBarContext()
  const { data: settings } = useSettingsContext()
  const [postalCodeQuery, setPostalCodeQuery] = useState<string>(city?.postalCode ?? '')
  const [isPostalCodeIneligible, setIsPostalCodeIneligible] = useState(false)
  const debouncedSetPostalCode = useRef(debounce(setPostalCodeQuery, 500)).current
  const { data: cities = [], isInitialLoading: isLoading } = useCities(postalCodeQuery, {
    onError: () => {
      showErrorSnackBar({
        message:
          'Nous avons eu un problème pour trouver la ville associée à ton code postal. Réessaie plus tard.',
        timeout: SNACK_BAR_TIME_OUT,
      })
      eventMonitoring.captureException(
        new IdentityCheckError('Failed to fetch data from API: https://geo.api.gouv.fr/communes')
      )
    },
    onSuccess: (cities) => {
      const isEmpty = cities.length === 0
      if (isEmpty)
        setError('postalCode', {
          message:
            'Ce code postal est introuvable. Réessaye un autre code postal ou renseigne un arrondissement (ex: 75001).',
        })
    },
  })

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
      onCitySelected?.()
      debouncedSetPostalCode(postalCode)
    },
    [debouncedSetPostalCode, onCitySelected]
  )

  const handlePostalCodeChange = (postalCode: string) => {
    setPostalCodeQuery(postalCode)
    if (settings) {
      setIsPostalCodeIneligible(settings.ineligiblePostalCodes.includes(postalCode))
    }
  }

  useEffect(() => {
    const subscription = watch(() => handleSubmit(onSubmit)())
    return () => subscription.unsubscribe()
  }, [onSubmit, handleSubmit, watch])

  const onPressOption = (cityKey: string) => {
    if (isPostalCodeIneligible) return
    const city = cities.find(
      (suggestedCity: SuggestedCity) => keyExtractor(suggestedCity) === cityKey
    )
    onCitySelected?.(city)
    Keyboard.dismiss()
  }

  const resetSearch = () => {
    resetForm({ postalCode: '' })
    setPostalCodeQuery('')
    setIsPostalCodeIneligible(false)
    onCitySelected?.()
  }

  return (
    <React.Fragment>
      <Form.MaxWidth>
        <Controller
          control={control}
          name="postalCode"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <StyledView>
              <SearchInput
                onChangeText={(text) => {
                  onChange(text)
                  handlePostalCodeChange(text)
                }}
                value={value}
                label="Indique ton code postal et choisis ta ville"
                format="75017"
                onPressRightIcon={resetSearch}
                keyboardType="number-pad"
                accessibilityHint={error?.message}
                testID="Entrée pour la ville"
                autoComplete="postal-code"
                textContentType="postalCode"
                searchInputID="postal-code-input"
              />
              <InputError errorMessage={error?.message} numberOfSpacesTop={2} visible={!!error} />
            </StyledView>
          )}
        />
      </Form.MaxWidth>
      {isPostalCodeIneligible ? (
        <InfoBannerContainer>
          <InfoBanner
            icon={Error}
            message="Malheureusement, ton code postal correspond à une zone qui n’est pas éligible au pass Culture."
          />
        </InfoBannerContainer>
      ) : (
        <React.Fragment>
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
      )}
    </React.Fragment>
  )
}

const CitiesContainer = styled.View({
  flexGrow: 1,
  overflowY: 'scroll',
  ...(Platform.OS === 'web' ? { boxSizing: 'content-box' } : {}),
})

const InfoBannerContainer = styled.View({ marginTop: getSpacing(4) })

const StyledView = styled.View({ marginBottom: getSpacing(2) })
