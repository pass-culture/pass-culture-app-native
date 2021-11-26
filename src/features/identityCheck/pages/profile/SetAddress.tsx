import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import debounce from 'lodash.debounce'
import React, { useEffect, useRef, useState } from 'react'
import { Keyboard, TouchableOpacity } from 'react-native'

import { useAppSettings } from 'features/auth/settings'
import { AddressOption } from 'features/identityCheck/atoms/AddressOption'
import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { ModalContent } from 'features/identityCheck/atoms/ModalContent'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { IdentityCheckError } from 'features/identityCheck/errors'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { eventMonitoring } from 'libs/monitoring'
import { useAddresses } from 'libs/place'
import { accessibilityAndTestId } from 'tests/utils'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { TextInput } from 'ui/components/inputs/TextInput'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { Spacer } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

export const SetAddress = () => {
  const { data: settings } = useAppSettings()
  const { profile } = useIdentityCheckContext()
  const { showErrorSnackBar } = useSnackBarContext()
  const { navigate } = useNavigation<UseNavigationType>()
  const { dispatch } = useIdentityCheckContext()
  const [query, setQuery] = useState<string>('')
  const [debouncedQuery, setDebouncedQuery] = useState<string>('')
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
  const debouncedSetQuery = useRef(debounce(setDebouncedQuery, 500)).current

  const { cityCode, postalCode } = profile
  const idCheckAddressAutocompletion = !!settings?.idCheckAddressAutocompletion

  const { data: addresses = [], isError } = useAddresses({
    query: debouncedQuery,
    cityCode: cityCode ?? '',
    postalCode: postalCode ?? '',
    enabled: idCheckAddressAutocompletion && debouncedQuery.length > 0,
    limit: 10,
  })

  useEffect(() => {
    if (!isError) return

    showErrorSnackBar({
      message: t`Nous avons eu un problème pour trouver l'adresse associée à ton code postal. Réessaie plus tard.`,
      timeout: SNACK_BAR_TIME_OUT,
    })

    eventMonitoring.captureException(
      new IdentityCheckError(
        'Failed to fetch data from API: https://api-adresse.data.gouv.fr/search'
      )
    )
  }, [isError])

  const onChangeAddress = (value: string) => {
    setQuery(value)
    debouncedSetQuery(value)
    setSelectedAddress('')
  }

  const onAddressSelection = (address: string) => {
    setSelectedAddress(address)
    Keyboard.dismiss()
  }

  const resetSearch = () => {
    setQuery('')
    debouncedSetQuery('')
    setSelectedAddress('')
  }

  const RightIcon = () => (
    <TouchableOpacity
      activeOpacity={ACTIVE_OPACITY}
      onPress={resetSearch}
      {...accessibilityAndTestId(t`Réinitialiser la recherche`)}>
      <Invalidate size={24} />
    </TouchableOpacity>
  )

  const onSubmit = (selectedAddress: string | null) => {
    if (selectedAddress) {
      dispatch({ type: 'SET_ADDRESS', payload: selectedAddress })
      navigate('IdentityCheckStatus')
    }
  }

  // The button is enabled only when the user has selected an address
  // if suggested addresses are available. Otherwise, if the user has
  // typed something and either the FF doesn't allow suggested addresses
  // or the API call fails, then the button is enabled
  const enabled =
    !isError && idCheckAddressAutocompletion && query.length > 0
      ? !!selectedAddress
      : query.length > 0

  return (
    <PageWithHeader
      title={t`Profil`}
      scrollChildren={
        <ModalContent>
          <CenteredTitle title={t`Quelle est ton adresse ?`} />
          <TextInput
            autoFocus
            onChangeText={onChangeAddress}
            value={query}
            label={t`Recherche et sélectionne ton adresse`}
            placeholder={t`Ex : 34 avenue de l'Opéra`}
            textContentType="addressState"
            onSubmitEditing={() => onSubmit(selectedAddress)}
            RightIcon={() => (query.length > 0 ? <RightIcon /> : null)}
            {...accessibilityAndTestId(t`Entrée pour l'adresse`)}
          />
          <Spacer.Column numberOfSpaces={2} />
          {addresses.map((option: string, index: number) => (
            <AddressOption
              option={option}
              selected={option === selectedAddress}
              onPressOption={onAddressSelection}
              key={option}
              {...accessibilityAndTestId(t`Proposition d'adresse ${index + 1} : ${option}`)}
            />
          ))}
        </ModalContent>
      }
      fixedBottomChildren={
        <ButtonPrimary
          onPress={() => onSubmit(selectedAddress)}
          title={t`Continuer`}
          disabled={!enabled}
        />
      }
    />
  )
}
