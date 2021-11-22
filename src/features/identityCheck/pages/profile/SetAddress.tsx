import { t } from '@lingui/macro'
import React, { useState } from 'react'

import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { ModalContent } from 'features/identityCheck/atoms/ModalContent'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { fetchAddresses } from 'libs/place'
import { accessibilityAndTestId } from 'tests/utils'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { TextInput } from 'ui/components/inputs/TextInput'
import { Typo } from 'ui/theme'

export const SetAddress = () => {
  const [address, setAddress] = useState('')
  const [addressOptions, setAddressOptions] = useState<string[]>([])

  function onAddressChange(value: string) {
    setAddress(value)
  }

  const onPress = () => {
    addressSearch()
  }

  const cityCode = null
  const postalCode = '75002'
  async function addressSearch() {
    try {
      const addressesLabels = await fetchAddresses({
        query: address,
        cityCode,
        postalCode,
      })
      setAddressOptions(addressesLabels)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err)
    }
  }

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
            value={address}
            label={t`Recherche et sélectionne ton adresse`}
            placeholder={t`Ex : 75017`}
            textContentType="addressState"
            onSubmitEditing={onPress}
            {...accessibilityAndTestId(t`Entrée pour l'adresse`)}
          />
          {addressOptions.map((option, index) => (
            <Typo.Body
              key={option}
              {...accessibilityAndTestId(t`Proposition d'adresse ${index + 1} : ${option}`)}>
              {option}
            </Typo.Body>
          ))}
        </ModalContent>
      }
      fixedBottomChildren={
        <ButtonPrimary onPress={onPress} title={t`Continuer`} disabled={false} />
      }
    />
  )
}
