import { useRoute, useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { getProfileStackConfig } from 'features/navigation/ProfileStackNavigator/getProfileStackConfig'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { DeleteProfileReasonNewEmailModal } from 'features/profile/components/Modals/DeleteProfileReasonNewEmailModal'
import { useCheckHasCurrentEmailChange } from 'features/profile/helpers/useCheckHasCurrentEmailChange'
import { useModal } from 'ui/components/modals/useModal'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'

import { ChangeEmailContent } from './ChangeEmailContent'

export function ChangeEmail() {
  const { params } = useRoute<UseRouteType<'ChangeEmail'>>()
  const { replace } = useNavigation<UseNavigationType>()
  const { hideModal, showModal, visible } = useModal(false)

  useEffect(() => {
    if (params?.showModal === true) return showModal()
  }, [params?.showModal, showModal])

  const handleHideModal = () => {
    hideModal()
    if (Platform.OS === 'web')
      return replace(...getProfileStackConfig('ChangeEmail', { showModal: false }))
  }

  const { hasCurrentEmailChange } = useCheckHasCurrentEmailChange()
  const { user } = useAuthContext()

  return (
    <React.Fragment>
      <SecondaryPageWithBlurHeader title="Modifier mon e-mail">
        <ChangeEmailContent hasCurrentEmailChange={hasCurrentEmailChange} user={user} />
      </SecondaryPageWithBlurHeader>
      <DeleteProfileReasonNewEmailModal isVisible={visible} hideModal={handleHideModal} />
    </React.Fragment>
  )
}

export const CenteredContainer = styled.View({
  flex: 1,
  alignItems: 'center',
})

export const ButtonContainer = styled.View<{ paddingBottom: number }>(({ paddingBottom }) => ({
  paddingBottom,
  alignItems: 'center',
  width: '100%',
}))
