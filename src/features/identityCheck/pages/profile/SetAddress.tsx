import { t } from '@lingui/macro'
import debounce from 'lodash.debounce'
import React, { useCallback, useEffect, useState } from 'react'

import { AddressOption } from 'features/identityCheck/atoms/AddressOption'
import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { ModalContent } from 'features/identityCheck/atoms/ModalContent'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { IdentityCheckError } from 'features/identityCheck/errors'
import { eventMonitoring } from 'libs/monitoring'
import { fetchAddresses } from 'libs/place/fetchAddresses'
import { accessibilityAndTestId } from 'tests/utils'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { TextInput } from 'ui/components/inputs/TextInput'
import { showErrorSnackBar } from 'ui/components/snackBar/__mocks__/SnackBarContext'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { Spacer } from 'ui/theme'

export const SetAddress = () => {
  // TODO (PC-11746) How to save address ?
  const [addressQuery, setAddressQuery] = useState('')
  const [cityInfo, setCityInfo] = useState({ cityCode: '', postalCode: '' })
  const [addressOptions, setAddressOptions] = useState<string[]>([])
  const [selectedAddress, setSelectedAddress] = useState('')

  useEffect(() => {
    // TODO (PC-11746) get cityCode and postalCode from SetPostalCode
    setCityInfo({
      cityCode: '',
      postalCode: '75002',
    })
  }, [])

  async function addressSearch(query: string) {
    const { cityCode, postalCode } = cityInfo
    try {
      const addressesLabels = await fetchAddresses({
        query,
        cityCode,
        postalCode,
      })
      setAddressOptions(addressesLabels)
    } catch (error) {
      showErrorSnackBar({
        message: t`Nous avons eu un problème pour trouver l'adresse associée à ton code postal. Réessaie plus tard.`,
        timeout: SNACK_BAR_TIME_OUT,
      })
      eventMonitoring.captureException(
        new IdentityCheckError(
          'Failed to fetch data from API: https://api-adresse.data.gouv.fr/search'
        )
      )
      //   TODO (LucasBeneston) : Add address without auto completion from api ?
      //   let addressWithoutAutoCompletion = query
      //   if (postalCode) addressWithoutAutoCompletion += `, ${postalCode}`
      //   setSelectedAddress(addressWithoutAutoCompletion)
    }
  }

  const debouncedAddressSearch = useCallback(debounce(addressSearch, 500), [cityInfo])
  function onAddressChange(value: string) {
    setAddressQuery(value)
    setSelectedAddress('')
    debouncedAddressSearch(value)
  }

  function onAddressSelection(address: string) {
    setAddressQuery(address)
    setSelectedAddress(address)
    setAddressOptions([])
  }

  const onSubmit = (address: string) => address

  return (
    <PageWithHeader
      title={t`Profil`}
      scrollChildren={
        <ModalContent>
          <CenteredTitle title={t`Quelle est ton adresse ?`} />
          <TextInput
            autoCapitalize="none"
            isError={false}
            autoFocus
            onChangeText={onAddressChange}
            value={addressQuery}
            label={t`Recherche et sélectionne ton adresse`}
            placeholder={t`Ex : 34 avenue de l'Opéra`}
            textContentType="addressState"
            onSubmitEditing={() => onSubmit(selectedAddress)}
            {...accessibilityAndTestId(t`Entrée pour l'adresse`)}
          />
          <Spacer.Column numberOfSpaces={2} />
          {addressOptions.map((option, index) => (
            <AddressOption
              option={option}
              onPressOption={onAddressSelection}
              key={option}
              {...accessibilityAndTestId(
                t`Proposition d'adresse ${index + 1} : ${option}`
              )}></AddressOption>
          ))}
        </ModalContent>
      }
      fixedBottomChildren={
        <ButtonPrimary
          onPress={() => onSubmit(selectedAddress)}
          title={t`Continuer`}
          disabled={false}
        />
      }
    />
  )
}
