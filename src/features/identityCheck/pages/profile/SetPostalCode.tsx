import { t } from '@lingui/macro'
import React, { useEffect, useState } from 'react'

import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { ModalContent } from 'features/identityCheck/atoms/ModalContent'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { IdentityCheckError } from 'features/identityCheck/errors'
import { CityModal } from 'features/identityCheck/pages/profile/CityModal'
import { isPostalCodeValid } from 'features/identityCheck/utils/ValidatePostalCode'
import { eventMonitoring } from 'libs/monitoring'
import { SuggestedCity } from 'libs/place'
import { useCities } from 'libs/place/useCities'
import { accessibilityAndTestId } from 'tests/utils'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InputError } from 'ui/components/inputs/InputError'
import { TextInput } from 'ui/components/inputs/TextInput'
import { useModal } from 'ui/components/modals/useModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export const SetPostalCode = () => {
  const { visible: isModalVisible, showModal, hideModal } = useModal(false)
  const { showErrorSnackBar } = useSnackBarContext()
  const [postalCode, setPostalCode] = useState('')
  const { data: cities, isError, isLoading, refetch } = useCities(postalCode)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { dispatch } = useIdentityCheckContext()

  function onPostalCodeChange(value: string) {
    setPostalCode(value)
    setErrorMessage(null)
  }

  function saveCity(city: SuggestedCity) {
    dispatch({ type: 'SET_CITY', payload: city })
  }

  useEffect(() => {
    if (isError) {
      showErrorSnackBar({
        message: t`Nous avons eu un problème pour trouver la ville associée à ton code postal. Réessaie plus tard.`,
        timeout: SNACK_BAR_TIME_OUT,
      })
      eventMonitoring.captureException(
        new IdentityCheckError('Failed to fetch data from API: https://geo.api.gouv.fr/communes')
      )
    }
  }, [isError])

  useEffect(() => {
    if (typeof cities === 'undefined') return
    if (cities.length === 0)
      setErrorMessage(
        t`Ce code postal est introuvable. Réessaye un autre code postal ou renseigne un arrondissement (ex: 75001).`
      )
    if (cities.length === 1) saveCity(cities[0])
    if (cities.length > 1) showModal()
  }, [cities?.length])

  async function onPress() {
    setErrorMessage(null)
    await refetch()
  }

  function onSubmitCity(city: SuggestedCity) {
    saveCity(city)
    hideModal()
  }

  return (
    <React.Fragment>
      <PageWithHeader
        title={t`Profil`}
        scrollChildren={
          <ModalContent>
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
            {!!errorMessage && (
              <InputError messageId={errorMessage} numberOfSpacesTop={2} visible />
            )}
          </ModalContent>
        }
        fixedBottomChildren={
          <ButtonPrimary
            onPress={onPress}
            title={t`Continuer`}
            disabled={!isPostalCodeValid(postalCode)}
            isLoading={isLoading}
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
