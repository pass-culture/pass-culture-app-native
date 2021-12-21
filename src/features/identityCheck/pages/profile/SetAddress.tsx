import { t } from '@lingui/macro'
import debounce from 'lodash.debounce'
import React, { useEffect, useRef, useState } from 'react'
import { Keyboard, Platform, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { useAppSettings } from 'features/auth/settings'
import { AddressOption } from 'features/identityCheck/atoms/AddressOption'
import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { IdentityCheckError } from 'features/identityCheck/errors'
import { useIdentityCheckNavigation } from 'features/identityCheck/useIdentityCheckNavigation'
import { eventMonitoring } from 'libs/monitoring'
import { useAddresses } from 'libs/place'
import { accessibilityAndTestId } from 'tests/utils'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { TextInput } from 'ui/components/inputs/TextInput'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Spinner } from 'ui/components/Spinner'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { Spacer } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

const snackbarMessage = t`Nous avons eu un problème pour trouver l'adresse associée à ton code postal. Réessaie plus tard.`
const exception = 'Failed to fetch data from API: https://api-adresse.data.gouv.fr/search'

export const SetAddress = () => {
  const { data: settings } = useAppSettings()
  const { dispatch, profile } = useIdentityCheckContext()
  const { showErrorSnackBar } = useSnackBarContext()
  const { navigateToNextScreen } = useIdentityCheckNavigation()
  const [query, setQuery] = useState<string>(profile.address || '')
  const [debouncedQuery, setDebouncedQuery] = useState<string>(query)
  const [selectedAddress, setSelectedAddress] = useState<string | null>(profile.address || null)
  const debouncedSetQuery = useRef(debounce(setDebouncedQuery, 500)).current

  const idCheckAddressAutocompletion = !!settings?.idCheckAddressAutocompletion

  const {
    data: addresses = [],
    isLoading,
    isError,
  } = useAddresses({
    query: debouncedQuery,
    cityCode: profile.city?.code ?? '',
    postalCode: profile.city?.postalCode ?? '',
    enabled: idCheckAddressAutocompletion && debouncedQuery.length > 0,
    limit: 10,
  })

  useEffect(() => {
    if (!isError) return
    showErrorSnackBar({ message: snackbarMessage, timeout: SNACK_BAR_TIME_OUT })
    eventMonitoring.captureException(new IdentityCheckError(exception))
  }, [isError])

  const onChangeAddress = (value: string) => {
    setSelectedAddress(null)
    setQuery(value)
    debouncedSetQuery(value)
  }

  const onAddressSelection = (address: string) => {
    setSelectedAddress(address)
    Keyboard.dismiss()
  }

  const resetSearch = () => {
    setSelectedAddress(null)
    setQuery('')
    debouncedSetQuery('')
  }

  const RightIcon = () => (
    <TouchableOpacity
      activeOpacity={ACTIVE_OPACITY}
      onPress={resetSearch}
      {...accessibilityAndTestId(t`Réinitialiser la recherche`)}>
      <Invalidate />
    </TouchableOpacity>
  )

  // The button is enabled only when the user has selected an address
  // if suggested addresses are available. Otherwise, if the user has
  // typed something and either the FF doesn't allow suggested addresses
  // or the API call fails, then the button is enabled
  const enabled =
    !isError && idCheckAddressAutocompletion && query.length > 0
      ? !!selectedAddress
      : query.length > 0

  const label = idCheckAddressAutocompletion
    ? t`Recherche et sélectionne ton adresse`
    : t`Entre ton adresse`

  const onPressContinue = () => {
    if (!enabled) return
    dispatch({ type: 'SET_ADDRESS', payload: selectedAddress || query })
    navigateToNextScreen()
  }

  return (
    <PageWithHeader
      title={t`Profil`}
      fixedTopChildren={
        <React.Fragment>
          <CenteredTitle title={t`Quelle est ton adresse\u00a0?`} />
          <Spacer.Column numberOfSpaces={5} />
          <TextInput
            autoFocus
            onChangeText={onChangeAddress}
            value={query}
            label={label}
            placeholder={t`Ex\u00a0: 34 avenue de l'Opéra`}
            textContentType="addressState"
            RightIcon={() => (query.length > 0 ? <RightIcon /> : null)}
            {...accessibilityAndTestId(t`Entrée pour l'adresse`)}
          />
          <Spacer.Column numberOfSpaces={2} />
        </React.Fragment>
      }
      scrollChildren={
        <React.Fragment>
          {!!isLoading && <Spinner />}
          <AdressesContainer>
            {addresses.map((address, index) => (
              <AddressOption
                label={address}
                selected={address === selectedAddress}
                onPressOption={onAddressSelection}
                optionKey={address}
                key={address}
                {...accessibilityAndTestId(t`Proposition d'adresse ${index + 1}\u00a0: ${address}`)}
              />
            ))}
          </AdressesContainer>
        </React.Fragment>
      }
      fixedBottomChildren={
        <ButtonPrimary onPress={onPressContinue} title={t`Continuer`} disabled={!enabled} />
      }
    />
  )
}

const AdressesContainer = styled.View({
  flexGrow: 1,
  overflowY: 'scroll',
  ...(Platform.OS === 'web' && { boxSizing: 'content-box' }),
})
