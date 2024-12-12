import { useNavigation } from '@react-navigation/native'
import debounce from 'lodash/debounce'
import React, { useEffect, useRef, useState } from 'react'
import { Keyboard, Platform } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { AddressOption } from 'features/identityCheck/components/AddressOption'
import { CenteredTitle } from 'features/identityCheck/components/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { IdentityCheckError } from 'features/identityCheck/pages/profile/errors'
import {
  useAddress,
  useAddressActions,
} from 'features/identityCheck/pages/profile/store/addressStore'
import { useCity } from 'features/identityCheck/pages/profile/store/cityStore'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/analytics'
import { eventMonitoring } from 'libs/monitoring'
import { useAddresses } from 'libs/place/useAddresses'
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
  const storedAddress = useAddress()
  const storedCity = useCity()
  const { setAddress: setStoreAddress } = useAddressActions()
  const { showErrorSnackBar } = useSnackBarContext()
  const { navigate } = useNavigation<UseNavigationType>()
  const [query, setQuery] = useState<string>(storedAddress ?? '')
  const [debouncedQuery, setDebouncedQuery] = useState<string>(query)
  const [selectedAddress, setSelectedAddress] = useState<string | null>(storedAddress ?? null)
  const debouncedSetQuery = useRef(debounce(setDebouncedQuery, 500)).current
  const addressInputErrorId = uuidv4()

  const idCheckAddressAutocompletion = !!settings?.idCheckAddressAutocompletion

  const {
    data: addresses = [],
    isLoading,
    isError,
  } = useAddresses({
    query: debouncedQuery,
    cityCode: storedCity?.code ?? '',
    postalCode: storedCity?.postalCode ?? '',
    enabled: idCheckAddressAutocompletion && debouncedQuery.length > 0,
    limit: 10,
  })

  useEffect(() => {
    analytics.logScreenViewSetAddress()
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

  const submitAddress = async () => {
    if (!enabled) return
    setStoreAddress(selectedAddress ?? query)
    analytics.logSetAddressClicked()
    navigate('SetStatus')
  }

  useEnterKeyAction(enabled ? submitAddress : undefined)

  return (
    <PageWithHeader
      title="Profil"
      scrollChildren={
        <React.Fragment>
          <Form.MaxWidth>
            <CenteredTitle title="Quelle est ton adresse&nbsp;?" />
            <Spacer.Column numberOfSpaces={5} />
            <SearchInput
              autoFocus
              onChangeText={onChangeAddress}
              value={query}
              label={label}
              placeholder="Ex&nbsp;: 34 avenue de l’Opéra"
              textContentType="addressState"
              accessibilityDescribedBy={addressInputErrorId}
              onPressRightIcon={resetSearch}
              returnKeyType="next"
              testID="Entrée pour l’adresse"
            />
            <InputError
              visible={hasError}
              messageId="Ton adresse ne doit pas contenir de caractères spéciaux ou n’être composée que d’espaces."
              numberOfSpacesTop={2}
              relatedInputId={addressInputErrorId}
            />
            <Spacer.Column numberOfSpaces={2} />
          </Form.MaxWidth>
          {isLoading ? <Spinner /> : null}
          <AdressesContainer accessibilityRole={AccessibilityRole.RADIOGROUP}>
            {addresses.map((address, index) => (
              <AddressOption
                label={address}
                selected={address === selectedAddress}
                onPressOption={onAddressSelection}
                optionKey={address}
                key={address}
                accessibilityLabel={`Proposition d’adresse ${index + 1}\u00a0: ${address}`}
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
