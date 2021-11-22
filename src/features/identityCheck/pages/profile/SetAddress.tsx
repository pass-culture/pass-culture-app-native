import { t } from '@lingui/macro'
import React, { useState } from 'react'

import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { ModalContent } from 'features/identityCheck/atoms/ModalContent'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { accessibilityAndTestId } from 'tests/utils'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { TextInput } from 'ui/components/inputs/TextInput'

export const SetAddress = () => {
  // TODO (11746) This goBack is temporary, remove when add save data and navigation
  const { goBack } = useGoBack(...homeNavConfig)
  const [address, setAddress] = useState('')

  function onAddressChange(value: string) {
    setAddress(value)
  }

  const onPress = () => {
    'onPress'
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
        </ModalContent>
      }
      fixedBottomChildren={<ButtonPrimary onPress={goBack} title={t`Continuer`} disabled={false} />}
    />
  )
}
