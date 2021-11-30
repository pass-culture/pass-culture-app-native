import { t } from '@lingui/macro'
import debounce from 'lodash.debounce'
import React, { useEffect, useRef, useState } from 'react'
import { FlatList, Keyboard, ListRenderItem, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { AddressOption } from 'features/identityCheck/atoms/AddressOption'
import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { IdentityCheckError } from 'features/identityCheck/errors'
import { useIdentityCheckNavigation } from 'features/identityCheck/useIdentityCheckNavigation'
import { eventMonitoring } from 'libs/monitoring'
import { SuggestedCity } from 'libs/place'
import { useCities } from 'libs/place/useCities'
import { accessibilityAndTestId } from 'tests/utils'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InputError } from 'ui/components/inputs/InputError'
import { TextInput } from 'ui/components/inputs/TextInput'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { getSpacing, Spacer } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

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

  const debouncedSetPostalCode = useRef(debounce(setDebouncedPostalCode, 500)).current
  const { data: cities = [], isError, isSuccess } = useCities(debouncedPostalCode)

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
    const city = cities.find((city: SuggestedCity) => keyExtractor(city) === cityKey)
    setSelectedCity(city || null)
    Keyboard.dismiss()
  }

  const resetSearch = () => {
    setSelectedCity(null)
    setErrorMessage(null)
    setQuery('')
    setDebouncedPostalCode('')
  }

  const RightIcon = () => (
    <TouchableOpacity
      activeOpacity={ACTIVE_OPACITY}
      onPress={resetSearch}
      {...accessibilityAndTestId(t`Réinitialiser la recherche`)}>
      <Invalidate />
    </TouchableOpacity>
  )

  const onPressContinue = () => {
    if (selectedCity === null) return
    dispatch({ type: 'SET_CITY', payload: selectedCity })
    navigateToNextScreen()
  }

  const renderItem: ListRenderItem<SuggestedCity> = ({ item: city, index }) => (
    <AddressOption
      label={city.name}
      selected={selectedCity ? keyExtractor(city) === keyExtractor(selectedCity) : false}
      onPressOption={onPressOption}
      optionKey={keyExtractor(city)}
      {...accessibilityAndTestId(t`Proposition de ville ${index + 1} : ${city.name}`)}
    />
  )

  return (
    <PageWithHeader
      title={t`Profil`}
      fixedTopChildren={
        <Container>
          <CenteredTitle title={t`Dans quelle ville résides-tu ?`} />
          <TextInput
            autoFocus
            onChangeText={onChangePostalCode}
            value={query}
            label={t`Indique ton code postal et choisis ta ville`}
            placeholder={t`Ex : 75017`}
            textContentType="postalCode"
            keyboardType="number-pad"
            RightIcon={() => (query.length > 0 ? <RightIcon /> : null)}
            {...accessibilityAndTestId(t`Entrée pour le code postal`)}
          />
          {!!errorMessage && <InputError messageId={errorMessage} numberOfSpacesTop={2} visible />}
          <Spacer.Column numberOfSpaces={2} />
          <FlatList
            data={cities}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          />
        </Container>
      }
      fixedBottomChildren={
        <ButtonPrimary
          onPress={onPressContinue}
          title={t`Continuer`}
          disabled={selectedCity === null}
        />
      }
    />
  )
}

const Container = styled.View({ paddingHorizontal: getSpacing(5) })
