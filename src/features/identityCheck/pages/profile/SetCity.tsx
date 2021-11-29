import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import debounce from 'lodash.debounce'
import React, { useEffect, useRef, useState } from 'react'
import { Keyboard, TouchableOpacity } from 'react-native'

import { AddressOption } from 'features/identityCheck/atoms/AddressOption'
import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { IdentityCheckError } from 'features/identityCheck/errors'
import { isPostalCodeValid } from 'features/identityCheck/utils/ValidatePostalCode'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { eventMonitoring } from 'libs/monitoring'
import { SuggestedCity } from 'libs/place'
import { useCities } from 'libs/place/useCities'
import { accessibilityAndTestId } from 'tests/utils'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
// import { InputError } from 'ui/components/inputs/InputError'
import { TextInput } from 'ui/components/inputs/TextInput'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { Spacer } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

export const SetCity = () => {
  const { showErrorSnackBar } = useSnackBarContext()
  const { navigate } = useNavigation<UseNavigationType>()
  const { dispatch } = useIdentityCheckContext()
  const [query, setQuery] = useState('')
  const [debouncedPostalCode, setDebouncedPostalCode] = useState<string>(query)
  const [selectedCity, setSelectedCity] = useState<SuggestedCity | null>(null)
  // const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const debouncedSetCity = useRef(debounce(setDebouncedPostalCode, 500)).current
  const { data: cities = [], isError } = useCities(debouncedPostalCode)

  useEffect(() => {
    if (!isError) return

    showErrorSnackBar({
      message: t`Nous avons eu un problème pour trouver la ville associée à ton code postal. Réessaie plus tard.`,
      timeout: SNACK_BAR_TIME_OUT,
    })

    eventMonitoring.captureException(
      new IdentityCheckError('Failed to fetch data from API: https://geo.api.gouv.fr/communes')
    )
  }, [isError])

  const onChangePostalCode = (value: string) => {
    setQuery(value)
    debouncedSetCity(value)
    setSelectedCity(null)
    // setErrorMessage(null)
  }

  const onPostalCodeSelection = (cityCode: string) => {
    const city = cities.find((city: SuggestedCity) => city.code === cityCode)
    setSelectedCity(city || null)
    Keyboard.dismiss()
  }

  const resetSearch = () => {
    setQuery('')
    setDebouncedPostalCode('')
    setSelectedCity(null)
    // setErrorMessage(null)
  }

  const RightIcon = () => (
    <TouchableOpacity
      activeOpacity={ACTIVE_OPACITY}
      onPress={resetSearch}
      {...accessibilityAndTestId(t`Réinitialiser la recherche`)}>
      <Invalidate />
    </TouchableOpacity>
  )

  const onSubmit = (city: SuggestedCity | null) => {
    if (selectedCity) {
      dispatch({ type: 'SET_CITY', payload: city })
      navigate('IdentityCheckAddress')
    }
  }

  return (
    <React.Fragment>
      <PageWithHeader
        title={t`Profil`}
        fixedTopChildren={<CenteredTitle title={t`Dans quelle ville résides-tu ?`} />}
        scrollChildren={
          <React.Fragment>
            <TextInput
              autoFocus
              onChangeText={onChangePostalCode}
              value={query}
              label={t`Code postal`}
              placeholder={t`Ex : 75017`}
              textContentType="postalCode"
              keyboardType="number-pad"
              onSubmitEditing={() => onSubmit(selectedCity)}
              RightIcon={() => (query.length > 0 ? <RightIcon /> : null)}
              {...accessibilityAndTestId(t`Entrée pour le code postal`)}
            />
            {/* {!!errorMessage && (
              <InputError messageId={errorMessage} numberOfSpacesTop={2} visible />
            )} */}
            <Spacer.Column numberOfSpaces={2} />
            {cities.map((city: SuggestedCity, index: number) => (
              <AddressOption
                label={city.name}
                selected={city.name === selectedCity?.name}
                onPressOption={onPostalCodeSelection}
                optionKey={city.name}
                key={city.name}
                {...accessibilityAndTestId(t`Proposition de ville ${index + 1} : ${city.name}`)}
              />
            ))}
          </React.Fragment>
        }
        fixedBottomChildren={
          <ButtonPrimary
            onPress={() => onSubmit(selectedCity)}
            title={t`Continuer`}
            disabled={!isPostalCodeValid(query)}
          />
        }
      />
    </React.Fragment>
  )
}
