import { useRoute, useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { Platform } from 'react-native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { getProfileHookConfig } from 'features/navigation/navigators/ProfileStackNavigator/getProfileHookConfig'
import { UseNavigationType, UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { DeleteProfileReasonNewEmailModal } from 'features/profile/components/Modals/DeleteProfileReasonNewEmailModal'
import { useCheckHasCurrentEmailChangeQuery } from 'features/profile/queries/useCheckHasCurrentEmailChangeQuery'
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
      return replace(...getProfileHookConfig('ChangeEmail', { showModal: false }))
  }

  const { hasCurrentEmailChange } = useCheckHasCurrentEmailChangeQuery()
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
