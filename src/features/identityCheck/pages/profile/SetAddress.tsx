import { useNavigation, useRoute } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { debounce } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { Keyboard, Platform } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { AddressOption } from 'features/identityCheck/components/AddressOption'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { IdentityCheckError } from 'features/identityCheck/pages/profile/errors'
import { addressActions, useAddress } from 'features/identityCheck/pages/profile/store/addressStore'
import { useCity } from 'features/identityCheck/pages/profile/store/cityStore'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { SubscriptionStackParamList } from 'features/navigation/SubscriptionStackNavigator/SubscriptionStackTypes'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { eventMonitoring } from 'libs/monitoring/services'
import { useAddresses } from 'libs/place/useAddresses'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { isAddressValid } from 'ui/components/inputs/addressCheck'
import { InputError } from 'ui/components/inputs/InputError'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Spinner } from 'ui/components/Spinner'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { getSpacing, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const snackbarMessage =
  'Nous avons eu un problème pour trouver l’adresse associée à ton code postal. Réessaie plus tard.'
const exception = 'Failed to fetch data from API: https://api-adresse.data.gouv.fr/search'

export const SetAddress = () => {
  const { params } = useRoute<UseRouteType<'SetAddress'>>()
  const type = params?.type ?? ProfileTypes.IDENTITY_CHECK // Fallback to most common scenario

  const identityCheckAndRecapExistingDataConfig = {
    headerTitle: 'Profil',
    title: 'Quelle est ton adresse\u00a0?',
  }
  const pageConfigByType = {
    [ProfileTypes.IDENTITY_CHECK]: identityCheckAndRecapExistingDataConfig,
    [ProfileTypes.BOOKING_FREE_OFFER_15_16]: {
      headerTitle: 'Informations personnelles',
      title: 'Saisis ton adresse postale',
    },
    [ProfileTypes.RECAP_EXISTING_DATA]: identityCheckAndRecapExistingDataConfig,
  }

  const { data: settings } = useSettingsContext()
  const storedAddress = useAddress()
  const storedCity = useCity()
  const { setAddress: setStoreAddress } = addressActions
  const { showErrorSnackBar } = useSnackBarContext()
  const { navigate } = useNavigation<StackNavigationProp<SubscriptionStackParamList>>()
  const [query, setQuery] = useState<string>(storedAddress ?? '')
  const [debouncedQuery, setDebouncedQuery] = useState<string>(query)
  const [selectedAddress, setSelectedAddress] = useState<string | null>(storedAddress ?? null)
  const debouncedSetQuery = useRef(debounce(setDebouncedQuery, 500)).current
  const addressInputErrorId = uuidv4()

  const idCheckAddressAutocompletion = !!settings?.idCheckAddressAutocompletion

  const {
    data: addresses = [],
    isInitialLoading: isLoading,
    isError,
  } = useAddresses({
    query: debouncedQuery,
    cityCode: storedCity?.code ?? '',
    postalCode: storedCity?.postalCode ?? '',
    enabled: idCheckAddressAutocompletion && debouncedQuery.length > 0,
    limit: 10,
  })

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

  const enabled = query.trim().length > 0

  const label = idCheckAddressAutocompletion
    ? 'Recherche et sélectionne ton adresse'
    : 'Entre ton adresse'

  const hasError = !isValidAddress && query.length > 0

  const submitAddress = async () => {
    if (!enabled) return
    setStoreAddress(selectedAddress ?? query)
    navigate('SetStatus', { type })
  }

  useEnterKeyAction(enabled ? submitAddress : undefined)

  return (
    <PageWithHeader
      title={pageConfigByType[type].headerTitle}
      scrollChildren={
        <React.Fragment>
          <Form.MaxWidth>
            <Typo.Title3 {...getHeadingAttrs(2)}>{pageConfigByType[type].title}</Typo.Title3>
            <Container>
              <SearchInput
                autoFocus
                onChangeText={onChangeAddress}
                value={query}
                label={label}
                format="34 avenue de l’Opéra"
                autoComplete="street-address"
                textContentType="fullStreetAddress"
                accessibilityDescribedBy={addressInputErrorId}
                onPressRightIcon={resetSearch}
                returnKeyType="next"
                testID="Entrée pour l’adresse"
                searchInputID="street-address-input"
              />
              <InputError
                visible={hasError}
                messageId="Ton adresse ne doit pas contenir de caractères spéciaux ou n’être composée que d’espaces."
                numberOfSpacesTop={2}
                relatedInputId={addressInputErrorId}
              />
            </Container>
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
          accessibilityLabel="Continuer vers le statut"
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

const Container = styled.View({ marginTop: getSpacing(5), marginBottom: getSpacing(2) })
