import { t } from '@lingui/macro'
import debounce from 'lodash.debounce'
import React, { useEffect, useRef, useState } from 'react'
import { FlatList, Keyboard, ListRenderItem, TouchableOpacity } from 'react-native'
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
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { getSpacing, Spacer } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

const keyExtractor = (address: string) => address

const snackbarMessage = t`Nous avons eu un problème pour trouver l'adresse associée à ton code postal. Réessaie plus tard.`
const exception = 'Failed to fetch data from API: https://api-adresse.data.gouv.fr/search'

export const SetAddress = () => {
  const { data: settings } = useAppSettings()
  const { profile } = useIdentityCheckContext()
  const { showErrorSnackBar } = useSnackBarContext()
  const { navigateToNextScreen } = useIdentityCheckNavigation()
  const { dispatch } = useIdentityCheckContext()
  const [query, setQuery] = useState<string>(profile.address || '')
  const [debouncedQuery, setDebouncedQuery] = useState<string>(query)
  const [selectedAddress, setSelectedAddress] = useState<string | null>(profile.address || null)
  const debouncedSetQuery = useRef(debounce(setDebouncedQuery, 500)).current

  const idCheckAddressAutocompletion = !!settings?.idCheckAddressAutocompletion

  const { data: addresses = [], isError } = useAddresses({
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

  const onPressContinue = () => {
    if (selectedAddress === null) return
    dispatch({ type: 'SET_ADDRESS', payload: selectedAddress })
    navigateToNextScreen()
  }

  // The button is enabled only when the user has selected an address
  // if suggested addresses are available. Otherwise, if the user has
  // typed something and either the FF doesn't allow suggested addresses
  // or the API call fails, then the button is enabled
  const enabled =
    !isError && idCheckAddressAutocompletion && query.length > 0
      ? !!selectedAddress
      : query.length > 0

  const renderItem: ListRenderItem<string> = ({ item: address, index }) => (
    <AddressOption
      label={address}
      selected={address === selectedAddress}
      onPressOption={onAddressSelection}
      optionKey={address}
      key={address}
      {...accessibilityAndTestId(t`Proposition d'adresse ${index + 1} : ${address}`)}
    />
  )

  return (
    <PageWithHeader
      title={t`Profil`}
      fixedTopChildren={
        <Container>
          <CenteredTitle title={t`Quelle est ton adresse ?`} />
          <TextInput
            autoFocus
            onChangeText={onChangeAddress}
            value={query}
            label={t`Recherche et sélectionne ton adresse`}
            placeholder={t`Ex : 34 avenue de l'Opéra`}
            textContentType="addressState"
            RightIcon={() => (query.length > 0 ? <RightIcon /> : null)}
            {...accessibilityAndTestId(t`Entrée pour l'adresse`)}
          />
          <Spacer.Column numberOfSpaces={2} />
          <FlatList
            data={addresses}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          />
        </Container>
      }
      fixedBottomChildren={
        <ButtonPrimary onPress={onPressContinue} title={t`Continuer`} disabled={!enabled} />
      }
    />
  )
}

const Container = styled.View({ paddingHorizontal: getSpacing(5) })
