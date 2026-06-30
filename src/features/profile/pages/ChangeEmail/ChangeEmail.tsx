import { useRoute, useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { Platform } from 'react-native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { getProfileHookConfig } from 'features/navigation/navigators/ProfileStackNavigator/getProfileHookConfig'
import { UseNavigationType, UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { DeleteProfileReasonNewEmailModal } from 'features/profile/components/Modals/DeleteProfileReasonNewEmailModal'
import {
  checkHasCurrentEmailChange,
  useProfileTokenExpirationQuery,
} from 'features/profile/queries/useProfileTokenExpirationQuery'
import { useModal } from 'ui/components/modals/useModal'
import { PageWithHeader } from 'ui/pages/PageWithHeader'

import { ChangeEmailContent } from './ChangeEmailContent'

export function ChangeEmail() {
  const { params } = useRoute<UseRouteType<'ChangeEmail'>>()
  const { replace } = useNavigation<UseNavigationType>()
  const { user } = useAuthContext()

  const { hideModal, showModal, visible } = useModal(false)

  useEffect(() => {
    if (params?.showModal === true) return showModal()
  }, [params?.showModal, showModal])

  const handleHideModal = () => {
    hideModal()
    if (Platform.OS === 'web')
      return replace(...getProfileHookConfig('ChangeEmail', { showModal: false }))
  }

  const { data: hasCurrentEmailChange } = useProfileTokenExpirationQuery({
    select: (data) => checkHasCurrentEmailChange(data),
  })

  return (
    <React.Fragment>
      <PageWithHeader
        title="Modifier mon e-mail"
        scrollChildren={
          <ChangeEmailContent hasCurrentEmailChange={hasCurrentEmailChange ?? false} user={user} />
        }
      />
      <DeleteProfileReasonNewEmailModal isVisible={visible} hideModal={handleHideModal} />
    </React.Fragment>
  )
}
