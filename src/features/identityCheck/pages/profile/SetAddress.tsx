import { t } from '@lingui/macro'
import React, { useEffect, useState } from 'react'

import { AddressOption } from 'features/identityCheck/atoms/AddressOption'
import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { ModalContent } from 'features/identityCheck/atoms/ModalContent'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { IdentityCheckError } from 'features/identityCheck/errors'
import { eventMonitoring } from 'libs/monitoring'
import { useAddresses } from 'libs/place/useAddresses'
import { accessibilityAndTestId } from 'tests/utils'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { TextInput } from 'ui/components/inputs/TextInput'
import { showErrorSnackBar } from 'ui/components/snackBar/__mocks__/SnackBarContext'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { SpinnerWithCenteredContainer } from 'ui/components/spinner/SpinnerWithCenteredContainer'
import { ColorsEnum, Spacer } from 'ui/theme'

export const SetAddress = () => {
  const [addressQuery, setAddressQuery] = useState('')
  const [cityInfo, setCityInfo] = useState({ cityCode: '', postalCode: '' })
  const [selectedAddress, setSelectedAddress] = useState('')
  const { data: addresses = [], isError, isLoading, refetch, remove } = useAddresses({
    query: addressQuery,
    cityCode: cityInfo.cityCode,
    postalCode: cityInfo.postalCode,
  })

  useEffect(() => {
    // TODO (LucasBeneston) get cityCode and postalCode from SetPostalCode
    setCityInfo({
      cityCode: '',
      postalCode: '75002',
    })
  }, [])

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

  function onAddressChange(value: string) {
    refetch()
    setAddressQuery(value)
    setSelectedAddress('')
  }

  function onAddressSelection(address: string) {
    setAddressQuery(address)
    setSelectedAddress(address)
    remove()
  }

  const onSubmit = (selectedAddress: string) => selectedAddress

  const inputLabel = selectedAddress
    ? t`Adresse sélectionnée`
    : t`Recherche et sélectionne ton adresse`

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
            label={inputLabel}
            placeholder={t`Ex : 34 avenue de l'Opéra`}
            textContentType="addressState"
            onSubmitEditing={() => onSubmit(selectedAddress)}
            {...accessibilityAndTestId(t`Entrée pour l'adresse`)}
          />
          <Spacer.Column numberOfSpaces={2} />
          {!!isLoading && <SpinnerWithCenteredContainer color={ColorsEnum.GREY_DARK} />}
          {addresses.map((option, index) => (
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
