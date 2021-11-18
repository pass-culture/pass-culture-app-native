import { t } from '@lingui/macro'
import React, { useState } from 'react'

import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { StyledScrollView } from 'features/identityCheck/atoms/StyledScrollView'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { IdentityCheckError } from 'features/identityCheck/errors'
import { City, CityModal } from 'features/identityCheck/pages/profile/CityModal'
import {
  composeValidators,
  required,
  zipCodeFormat,
} from 'features/identityCheck/utils/ValidateFields'
import { eventMonitoring } from 'libs/monitoring'
import { fetchCities } from 'libs/place/fetchPostalCode'
import { accessibilityAndTestId } from 'tests/utils'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InputError } from 'ui/components/inputs/InputError'
import { TextInput } from 'ui/components/inputs/TextInput'
import { useModal } from 'ui/components/modals/useModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

const validator = composeValidators(required, zipCodeFormat)

export const SetPostalCode = () => {
  const { visible: isModalVisible, showModal, hideModal } = useModal(false)
  const { showErrorSnackBar } = useSnackBarContext()
  const [postalCode, setPostalCode] = useState('')
  const [isPostalCodeInvalid, setIsPostalCodeInvalid] = useState(true)
  const [cities, setCities] = useState<City[]>([])
  const [isLoadingCities, setIsLoadingCities] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isDisabled = isPostalCodeInvalid

  function onPostalCodeChange(value: string) {
    setIsPostalCodeInvalid(validator(value))
    setPostalCode(value)
    setError(null)
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
      showErrorSnackBar({
        message: t`Nous avons eu un problème pour trouver la ville associée à ton code postal. Réessaie plus tard.`,
        timeout: SNACK_BAR_TIME_OUT,
      })
      eventMonitoring.captureException(
        new IdentityCheckError('Failed to fetch data from API: https://geo.api.gouv.fr/communes')
      )
    }
    if (citiesResult.length === 0) {
      setError(
        t`Ce code postal est introuvable. Réessaye un autre code postal ou renseigne un arrondissement (ex: 75001).`
      )
    }
    if (citiesResult.length === 1) {
      const city = citiesResult[0]
      // TODO (11746) How to save postal code and city ?
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
        setError(null)
        setIsLoadingCities(true)
        await searchCities(postalCode.replace(/\s/g, ''))
      } finally {
        setIsLoadingCities(false)
      }
    }
  }

  async function onSubmitCity(city: City) {
    hideModal()
    // TODO (11746) How to save postal code and city ?
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
              label={t`Code postal`}
              placeholder={t`Ex : 75017`}
              textContentType="postalCode"
              keyboardType="number-pad"
              onSubmitEditing={onPress}
              {...accessibilityAndTestId(t`Entrée pour le code postal`)}
            />
            {!!error && <InputError messageId={error} numberOfSpacesTop={2} visible />}
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
