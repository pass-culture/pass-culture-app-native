import { t } from '@lingui/macro'
import debounce from 'lodash.debounce'
import React, { useCallback, useEffect, useState } from 'react'

import { AddressOption } from 'features/identityCheck/atoms/AddressOption'
import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { ModalContent } from 'features/identityCheck/atoms/ModalContent'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { fetchAddresses } from 'libs/place'
import { accessibilityAndTestId } from 'tests/utils'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { TextInput } from 'ui/components/inputs/TextInput'
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
      // TODO (LucasBeneston) : if error, add address without auto completion from api like "query, postalCode" ?
      // eslint-disable-next-line no-console
      console.log(error)
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
