import { useNavigation } from '@react-navigation/native'
import debounce from 'lodash/debounce'
import React, { useEffect, useRef, useState } from 'react'
import { Keyboard, Platform } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { AddressOption } from 'features/identityCheck/components/AddressOption'
import { CenteredTitle } from 'features/identityCheck/components/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { IdentityCheckError } from 'features/identityCheck/pages/profile/errors'
import { useCity, useCityActions } from 'features/identityCheck/pages/profile/store/cityStore'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/analytics'
import { eventMonitoring } from 'libs/monitoring'
import { SuggestedCity } from 'libs/place/types'
import { useCities } from 'libs/place/useCities'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { InputError } from 'ui/components/inputs/InputError'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { Li } from 'ui/components/Li'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Spinner } from 'ui/components/Spinner'
import { VerticalUl } from 'ui/components/Ul'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { Spacer } from 'ui/theme'

const keyExtractor = ({ name, code, postalCode }: SuggestedCity) => `${name}-${code}-${postalCode}`

const snackbarMessage =
  'Nous avons eu un problème pour trouver la ville associée à ton code postal. Réessaie plus tard.'
const exception = 'Failed to fetch data from API: https://geo.api.gouv.fr/communes'
const noPostalCodeFound =
  'Ce code postal est introuvable. Réessaye un autre code postal ou renseigne un arrondissement (ex: 75001).'

export const SetCity = () => {
  const { showErrorSnackBar } = useSnackBarContext()
  const { navigate } = useNavigation<UseNavigationType>()
  const storedCity = useCity()
  const { setCity: setStoredCity } = useCityActions()
  const [query, setQuery] = useState(storedCity?.postalCode ?? '')
  const [debouncedPostalCode, setDebouncedPostalCode] = useState<string>(query)
  const [selectedCity, setSelectedCity] = useState<SuggestedCity | null>(storedCity ?? null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    analytics.logScreenViewSetCity()
  }, [])

  const postalCodeInputErrorId = uuidv4()

  const debouncedSetPostalCode = useRef(debounce(setDebouncedPostalCode, 500)).current
  const { data: cities = [], isLoading, isError, isSuccess } = useCities(debouncedPostalCode)

  useEffect(() => {
    if (storedCity?.name) {
      const city = cities.find(
        (suggestedCity: SuggestedCity) => suggestedCity.name === storedCity?.name
      )
      setSelectedCity(city ?? null)
    }
  }, [cities, storedCity?.name])

  useEffect(() => {
    if (!isError) return
    showErrorSnackBar({ message: snackbarMessage, timeout: SNACK_BAR_TIME_OUT })
    eventMonitoring.captureException(new IdentityCheckError(exception))
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setSelectedCity(city ?? null)
    Keyboard.dismiss()
  }

  const resetSearch = () => {
    setSelectedCity(null)
    setErrorMessage(null)
    setQuery('')
    setDebouncedPostalCode('')
  }

  const submitCity = async () => {
    if (selectedCity === null) return
    setStoredCity(selectedCity)
    analytics.logSetPostalCodeClicked()
    navigate('SetAddress')
  }

  const disabled = selectedCity === null

  useEnterKeyAction(disabled ? undefined : submitCity)

  return (
    <PageWithHeader
      title="Profil"
      scrollChildren={
        <React.Fragment>
          <Form.MaxWidth>
            <CenteredTitle title="Dans quelle ville résides-tu&nbsp;?" />
            <Spacer.Column numberOfSpaces={5} />
            <SearchInput
              autoFocus
              onChangeText={onChangePostalCode}
              value={query}
              label="Indique ton code postal et choisis ta ville"
              placeholder="Ex&nbsp;: 75017"
              textContentType="postalCode"
              onPressRightIcon={resetSearch}
              keyboardType="number-pad"
              accessibilityDescribedBy={postalCodeInputErrorId}
              testID="Entrée pour la ville"
            />
            <InputError
              messageId={errorMessage}
              numberOfSpacesTop={2}
              visible={!!errorMessage}
              relatedInputId={postalCodeInputErrorId}
            />
            <Spacer.Column numberOfSpaces={2} />
          </Form.MaxWidth>
          {isLoading ? <Spinner /> : null}
          <CitiesContainer accessibilityRole={AccessibilityRole.RADIOGROUP}>
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
                    accessibilityLabel={`Proposition de ville ${index + 1}\u00a0: ${city.name}`}
                  />
                </Li>
              ))}
            </VerticalUl>
          </CitiesContainer>
        </React.Fragment>
      }
      fixedBottomChildren={
        <ButtonPrimary
          type="submit"
          onPress={submitCity}
          wording="Continuer"
          accessibilityLabel="Continuer vers l’étape suivante"
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
