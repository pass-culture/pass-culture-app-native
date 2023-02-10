import debounce from 'lodash/debounce'
import React, { useEffect, useRef, useState } from 'react'
import { Keyboard, Platform } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { AddressOption } from 'features/identityCheck/components/AddressOption'
import { CenteredTitle } from 'features/identityCheck/components/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { useSubscriptionNavigation } from 'features/identityCheck/pages/helpers/useSubscriptionNavigation'
import { IdentityCheckError } from 'features/identityCheck/pages/profile/errors'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { amplitude } from 'libs/amplitude'
import { eventMonitoring } from 'libs/monitoring'
import { useAddresses } from 'libs/place'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { isAddressValid } from 'ui/components/inputs/addressCheck'
import { InputError } from 'ui/components/inputs/InputError'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Spinner } from 'ui/components/Spinner'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { Spacer } from 'ui/theme'

const snackbarMessage =
  'Nous avons eu un problème pour trouver l’adresse associée à ton code postal. Réessaie plus tard.'
const exception = 'Failed to fetch data from API: https://api-adresse.data.gouv.fr/search'

export const SetAddress = () => {
  const { data: settings } = useSettingsContext()
  const { dispatch, profile } = useSubscriptionContext()
  const { showErrorSnackBar } = useSnackBarContext()
  const { navigateToNextScreen } = useSubscriptionNavigation()
  const [query, setQuery] = useState<string>(profile.address || '')
  const [debouncedQuery, setDebouncedQuery] = useState<string>(query)
  const [selectedAddress, setSelectedAddress] = useState<string | null>(profile.address || null)
  const debouncedSetQuery = useRef(debounce(setDebouncedQuery, 500)).current
  const adressInputErrorId = uuidv4()

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
    amplitude.logEvent('screen_view_set_address')
  }, [])

  useEffect(() => {
    if (!isError) return
    showErrorSnackBar({ message: snackbarMessage, timeout: SNACK_BAR_TIME_OUT })
    eventMonitoring.captureException(new IdentityCheckError(exception))
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const isValidAddress = isAddressValid(query)

  // The button is enabled only when the user has selected an address
  // if suggested addresses are available. Otherwise, if the user has
  // typed something and either the FF doesn't allow suggested addresses
  // or the API call fails, then the button is enabled
  const enabled =
    !isError && idCheckAddressAutocompletion && query.length > 0
      ? !!selectedAddress
      : isValidAddress

  const label = idCheckAddressAutocompletion
    ? 'Recherche et sélectionne ton adresse'
    : 'Entre ton adresse'

  const hasError = !isValidAddress && query.length > 0

  const submitAddress = () => {
    if (!enabled) return
    dispatch({ type: 'SET_ADDRESS', payload: selectedAddress || query })
    amplitude.logEvent('set_address_clicked')
    navigateToNextScreen()
  }

  useEnterKeyAction(enabled ? submitAddress : undefined)

  return (
    <PageWithHeader
      title="Profil"
      fixedTopChildren={
        <Form.MaxWidth>
          <CenteredTitle title="Quelle est ton adresse&nbsp;?" />
          <Spacer.Column numberOfSpaces={5} />
          <SearchInput
            autoFocus
            onChangeText={onChangeAddress}
            value={query}
            label={label}
            placeholder="Ex&nbsp;: 34 avenue de l'Opéra"
            textContentType="addressState"
            accessibilityDescribedBy={adressInputErrorId}
            onPressRightIcon={resetSearch}
            returnKeyType="next"
          />
          <InputError
            visible={hasError}
            messageId="Ton adresse ne doit pas contenir de caractères spéciaux ou n’être composée que d’espaces."
            numberOfSpacesTop={2}
            relatedInputId={adressInputErrorId}
          />
          <Spacer.Column numberOfSpaces={2} />
        </Form.MaxWidth>
      }
      scrollChildren={
        <React.Fragment>
          {!!isLoading && <Spinner />}
          <AdressesContainer accessibilityRole={AccessibilityRole.RADIOGROUP}>
            {addresses.map((address, index) => (
              <AddressOption
                label={address}
                selected={address === selectedAddress}
                onPressOption={onAddressSelection}
                optionKey={address}
                key={address}
                accessibilityLabel={`Proposition d'adresse ${index + 1}\u00a0: ${address}`}
              />
            ))}
          </AdressesContainer>
        </React.Fragment>
      }
      fixedBottomChildren={
        <ButtonPrimary
          type="submit"
          onPress={submitAddress}
          wording="Continuer"
          accessibilityLabel="Continuer vers l’étape suivante"
          disabled={!enabled}
        />
      }
    />
  )
}

const AdressesContainer = styled.View({
  flexGrow: 1,
  overflowY: 'scroll',
  ...(Platform.OS === 'web' ? { boxSizing: 'content-box' } : {}),
})
