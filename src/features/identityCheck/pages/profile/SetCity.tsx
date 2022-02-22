import { t } from '@lingui/macro'
import debounce from 'lodash.debounce'
import React, { useEffect, useRef, useState } from 'react'
import { Keyboard, Platform } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { AddressOption } from 'features/identityCheck/atoms/AddressOption'
import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { IdentityCheckError } from 'features/identityCheck/errors'
import { useIdentityCheckNavigation } from 'features/identityCheck/useIdentityCheckNavigation'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { eventMonitoring } from 'libs/monitoring'
import { SuggestedCity } from 'libs/place'
import { useCities } from 'libs/place/useCities'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InputError } from 'ui/components/inputs/InputError'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Spinner } from 'ui/components/Spinner'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { Spacer } from 'ui/theme'
import { Form } from 'ui/web/form/Form'
import { Li } from 'ui/web/list/Li'
import { VerticalUl } from 'ui/web/list/Ul'

const keyExtractor = ({ name, code, postalCode }: SuggestedCity) => `${name}-${code}-${postalCode}`

const snackbarMessage = t`Nous avons eu un problème pour trouver la ville associée à ton code postal. Réessaie plus tard.`
const exception = 'Failed to fetch data from API: https://geo.api.gouv.fr/communes'
const noPostalCodeFound = t`Ce code postal est introuvable. Réessaye un autre code postal ou renseigne un arrondissement (ex: 75001).`

export const SetCity = () => {
  const { showErrorSnackBar } = useSnackBarContext()
  const { navigateToNextScreen } = useIdentityCheckNavigation()
  const { dispatch, profile } = useIdentityCheckContext()
  const [query, setQuery] = useState(profile.city?.postalCode || '')
  const [debouncedPostalCode, setDebouncedPostalCode] = useState<string>(query)
  const [selectedCity, setSelectedCity] = useState<SuggestedCity | null>(profile.city || null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const postalCodeInputErrorId = uuidv4()

  const debouncedSetPostalCode = useRef(debounce(setDebouncedPostalCode, 500)).current
  const { data: cities = [], isLoading, isError, isSuccess } = useCities(debouncedPostalCode)

  useEffect(() => {
    if (!isError) return
    showErrorSnackBar({ message: snackbarMessage, timeout: SNACK_BAR_TIME_OUT })
    eventMonitoring.captureException(new IdentityCheckError(exception))
  }, [isError])

  useEffect(() => {
    if (isSuccess && cities.length === 0) setErrorMessage(noPostalCodeFound)
  }, [isSuccess, cities.length])

  const onChangePostalCode = (value: string) => {
    setSelectedCity(null)
    setErrorMessage(null)
    setQuery(value)
    debouncedSetPostalCode(value)
  }

  const onPressOption = (cityKey: string) => {
    const city = cities.find(
      (suggestedCity: SuggestedCity) => keyExtractor(suggestedCity) === cityKey
    )
    setSelectedCity(city || null)
    Keyboard.dismiss()
  }

  const resetSearch = () => {
    setSelectedCity(null)
    setErrorMessage(null)
    setQuery('')
    setDebouncedPostalCode('')
  }

  const submitCity = () => {
    if (selectedCity === null) return
    dispatch({ type: 'SET_CITY', payload: selectedCity })
    navigateToNextScreen()
  }

  const disabled = selectedCity === null

  useEnterKeyAction(!disabled ? submitCity : undefined)

  return (
    <PageWithHeader
      title={t`Profil`}
      fixedTopChildren={
        <Form.MaxWidth>
          <CenteredTitle title={t`Dans quelle ville résides-tu\u00a0?`} />
          <Spacer.Column numberOfSpaces={5} />
          <SearchInput
            autoFocus
            onChangeText={onChangePostalCode}
            value={query}
            label={t`Indique ton code postal et choisis ta ville`}
            placeholder={t`Ex\u00a0: 75017`}
            textContentType="postalCode"
            accessibilityLabel={t`Entrée pour le code postal`}
            onPressRightIcon={resetSearch}
            keyboardType="number-pad"
            accessibilityDescribedBy={postalCodeInputErrorId}
          />
          {!!errorMessage && (
            <InputError
              messageId={errorMessage}
              numberOfSpacesTop={2}
              visible
              relatedInputId={postalCodeInputErrorId}
            />
          )}
          <Spacer.Column numberOfSpaces={2} />
        </Form.MaxWidth>
      }
      scrollChildren={
        <React.Fragment>
          {!!isLoading && <Spinner />}
          <CitiesContainer>
            <VerticalUl>
              {cities.map((city, index) => (
                <Li key={city.name}>
                  <AddressOption
                    label={city.name}
                    selected={
                      selectedCity ? keyExtractor(city) === keyExtractor(selectedCity) : false
                    }
                    onPressOption={onPressOption}
                    optionKey={keyExtractor(city)}
                    {...accessibilityAndTestId(
                      t`Proposition de ville ${index + 1}\u00a0: ${city.name}`
                    )}
                  />
                </Li>
              ))}
            </VerticalUl>
          </CitiesContainer>
        </React.Fragment>
      }
      fixedBottomChildren={
        <ButtonPrimary
          onPress={submitCity}
          wording={t`Continuer`}
          accessibilityLabel={t`Continuer vers l'étape suivante`}
          disabled={disabled}
        />
      }
    />
  )
}

const CitiesContainer = styled.View({
  flexGrow: 1,
  overflowY: 'scroll',
  ...(Platform.OS === 'web' ? { boxSizing: 'content-box' } : {}),
})
