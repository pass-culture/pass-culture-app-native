import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import debounce from 'lodash.debounce'
import React, { useEffect, useRef, useState } from 'react'
import { Keyboard, TouchableOpacity } from 'react-native'

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
  const { showErrorSnackBar } = useSnackBarContext()
  const { navigate } = useNavigation<UseNavigationType>()
  const { dispatch } = useIdentityCheckContext()
  const [addressQuery, setAddressQuery] = useState('')
  const [debouncedAddress, setDebouncedAddress] = useState<string>(addressQuery)
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
  const debouncedSetAddress = useRef(debounce(setDebouncedAddress, 500)).current

  // TODO (LucasBeneston, antoinewg): Récupérer cityCode / postalCode du context idcheck
  const { data: addresses = [], isError } = useAddresses({
    query: debouncedAddress,
    cityCode: '',
    postalCode: '',
    limit: 10,
  })

  useEffect(() => {
    if (isError) {
      showErrorSnackBar({
        message: t`Nous avons eu un problème pour trouver l'adresse associée à ton code postal. Réessaie plus tard.`,
        timeout: SNACK_BAR_TIME_OUT,
      })
      eventMonitoring.captureException(
        new IdentityCheckError(
          'Failed to fetch data from API: https://api-adresse.data.gouv.fr/search'
        )
      )
    }
  }, [isError])

  const onChangeAddress = (value: string) => {
    setAddressQuery(value)
    debouncedSetAddress(value)
    setSelectedAddress(null)
  }

  const onAddressSelection = (address: string) => {
    setSelectedAddress(address)
    Keyboard.dismiss()
  }

  const resetSearch = () => {
    setAddressQuery('')
    setDebouncedAddress('')
    setSelectedAddress(null)
  }

  const RightIcon = () =>
    addressQuery.length > 0 ? (
      <TouchableOpacity
        activeOpacity={ACTIVE_OPACITY}
        onPress={resetSearch}
        {...accessibilityAndTestId(t`Réinitialiser la recherche`)}>
        <Invalidate />
      </TouchableOpacity>
    ) : null

  const onSubmit = (selectedAddress: string | null) => {
    if (selectedAddress) {
      dispatch({ type: 'SET_ADDRESS', payload: selectedAddress })
      navigate('IdentityCheckStatus')
    }
  }

  return (
    <PageWithHeader
      title={t`Profil`}
      scrollChildren={
        <ModalContent>
          <CenteredTitle title={t`Quelle est ton adresse ?`} />
          <TextInput
            autoFocus
            onChangeText={onChangeAddress}
            value={addressQuery}
            label={t`Recherche et sélectionne ton adresse`}
            placeholder={t`Ex : 34 avenue de l'Opéra`}
            textContentType="addressState"
            onSubmitEditing={() => onSubmit(selectedAddress)}
            RightIcon={() => <RightIcon />}
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
          disabled={!selectedAddress}
        />
      }
    />
  )
}
