import { t } from '@lingui/macro'
import React, { useState } from 'react'

import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { StyledScrollView } from 'features/identityCheck/atoms/StyledScrollView'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { City, CityModal } from 'features/identityCheck/pages/profile/CityModal'
import {
  composeValidators,
  required,
  zipCodeFormat,
} from 'features/identityCheck/utils/ValidateFields'
import { fetchCities } from 'libs/place/fetchPostalCode'
import { accessibilityAndTestId } from 'tests/utils'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { TextInput } from 'ui/components/inputs/TextInput'
import { useModal } from 'ui/components/modals/useModal'

const validator = composeValidators(required, zipCodeFormat)

export const SetPostalCode = () => {
  const { visible: isModalVisible, showModal, hideModal } = useModal(false)
  const [postalCode, setPostalCode] = useState('')
  const [isPostalCodeInvalid, setIsPostalCodeInvalid] = useState(true)
  const [cities, setCities] = useState<City[]>([])
  const [isLoadingCities, setIsLoadingCities] = useState(false)

  const isDisabled = isPostalCodeInvalid

  function onPostalCodeChange(value: string) {
    setIsPostalCodeInvalid(validator(value))
    setPostalCode(value)
  }

  async function searchCities(postalCodeQuery: string) {
    let citiesResult: City[] = []
    try {
      const response = await fetchCities(postalCodeQuery)
      citiesResult = response.map(({ nom, code }) => ({
        name: nom,
        code,
        postalCode: postalCodeQuery,
      }))
      setCities(citiesResult)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log({ error })
    }

    if (citiesResult.length === 0) {
      // eslint-disable-next-line no-console
      console.log('error : Ce code postal est introuvable.')
    }
    if (citiesResult.length === 1) {
      const city = citiesResult[0]
      // eslint-disable-next-line no-console
      console.log('savePostalCodeAndCity: ', city)
    }
    if (citiesResult.length > 1) {
      showModal()
    }
  }

  async function onPress() {
    if (!isDisabled) {
      try {
        setIsLoadingCities(true)
        await searchCities(postalCode.replace(/\s/g, ''))
      } finally {
        setIsLoadingCities(false)
      }
    }
  }

  async function onSubmitCity(city: City) {
    hideModal()
    // eslint-disable-next-line no-console
    console.log('savePostalCodeAndCity: ', city)
  }

  return (
    <React.Fragment>
      <PageWithHeader
        title={t`Profil`}
        scrollChildren={
          <StyledScrollView>
            <CenteredTitle title={t`Dans quelle ville résides-tu ?`} />
            <TextInput
              autoCapitalize="none"
              isError={false}
              autoFocus
              onChangeText={onPostalCodeChange}
              value={postalCode}
              label="Code postal"
              placeholder="Ex : 75017"
              textContentType="postalCode"
              keyboardType="number-pad"
              onSubmitEditing={onPress}
              {...accessibilityAndTestId(t`Entrée pour le code postal`)}
            />
          </StyledScrollView>
        }
        fixedBottomChildren={
          <ButtonPrimary
            onPress={onPress}
            title={t`Continuer`}
            disabled={isDisabled}
            isLoading={isLoadingCities}
          />
        }
      />
      <CityModal
        cities={cities}
        isVisible={isModalVisible}
        onSubmit={onSubmitCity}
        close={hideModal}
      />
    </React.Fragment>
  )
}
