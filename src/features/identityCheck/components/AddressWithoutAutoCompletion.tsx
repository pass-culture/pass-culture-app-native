import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'

import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { ModalContent } from 'features/identityCheck/atoms/ModalContent'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { accessibilityAndTestId } from 'tests/utils'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { TextInput } from 'ui/components/inputs/TextInput'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

export const AddressWithoutAutoCompletion =  () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { dispatch } = useIdentityCheckContext()
  const [addressQuery, setAddressQuery] = useState('')

  const onChangeAddress = (value: string) => {
    setAddressQuery(value)
  }

  const resetSearch = () => {
    setAddressQuery('')
  }

  const RightIcon = () =>
    addressQuery.length > 0 ? (
      <TouchableOpacity
        activeOpacity={ACTIVE_OPACITY}
        onPress={resetSearch}
        {...accessibilityAndTestId(t`Réinitialiser la recherche`)}>
        <Invalidate size={24} />
      </TouchableOpacity>
    ) : null

  const onSubmit = () => {
    dispatch({ type: 'SET_ADDRESS', payload: addressQuery })
    navigate('IdentityCheckStatus')
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
            onSubmitEditing={onSubmit}
            RightIcon={() => <RightIcon />}
            {...accessibilityAndTestId(t`Entrée pour l'adresse`)}
          />
        </ModalContent>
      }
      fixedBottomChildren={
        <ButtonPrimary
          onPress={onSubmit}
          title={t`Continuer`}
          disabled={!addressQuery}
        />
      }
    />
  )
}
