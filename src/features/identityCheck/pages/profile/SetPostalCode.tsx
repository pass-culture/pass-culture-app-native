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
import { accessibilityAndTestId } from 'tests/utils'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { TextInput } from 'ui/components/inputs/TextInput'

const validator = composeValidators(required, zipCodeFormat)

export const SetPostalCode = () => {
  const [postalCode, setPostalCode] = useState('')
  const [isPostalCodeInvalid, setIsPostalCodeInvalid] = useState(true)
  const [isLoadingCities, setIsLoadingCities] = useState(false)

  const cities: City[] = [
    { name: 'Paris', code: '75000', postalCode: '75000' },
    { name: 'Lyon', code: '69000', postalCode: '69000' },
    { name: 'Saint-Étienne', code: '42000', postalCode: '42000' },
  ]

  const isDisabled = isPostalCodeInvalid

  function onPostalCodeChange(value: string) {
    setIsPostalCodeInvalid(validator(value))
    setPostalCode(value)
  }

  async function onPress() {
    if (!isDisabled) {
      try {
        setIsLoadingCities(true)
        // await searchCities(postalCode.replace(/\s/g, ''))
      } finally {
        setIsLoadingCities(false)
      }
    }
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
      <CityModal cities={cities} isVisible={true} onSubmit={(city: City) => city} />
    </React.Fragment>
  )
}
