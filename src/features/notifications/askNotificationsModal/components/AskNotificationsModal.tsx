import { BatchPush } from '@batch.com/react-native-plugin'
import React, { FunctionComponent, useCallback } from 'react'
import { Linking, Platform } from 'react-native'
import { checkNotifications, requestNotifications, RESULTS } from 'react-native-permissions'
import styled from 'styled-components/native'

import { analytics } from 'libs/firebase/analytics'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { BicolorRingingBell } from 'ui/svg/BicolorRingingBell'
import { Spacer, Typo } from 'ui/theme'
import { DOUBLE_LINE_BREAK } from 'ui/theme/constants'

interface Props {
  visible: boolean
  onHideModal: () => void
}

export const AskNotificiationsModal: FunctionComponent<Props> = ({ visible, onHideModal }) => {
  const acceptNotifications = useCallback(async () => {
    analytics.logAcceptNotifications()
    const permission = await checkNotifications()

    if (permission.status === RESULTS.GRANTED) {
      onHideModal()
    } else if (permission.status === RESULTS.DENIED) {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        // We need to get detailed permission to know if user has already denied permission before
        const detailedPermission = await requestNotifications([])
        const isBlocked = detailedPermission.status === RESULTS.BLOCKED

        onHideModal()
        isBlocked && Linking.openSettings()
      } else {
        onHideModal()
        BatchPush.requestNotificationAuthorization() //  For iOS
      }
    } else {
      onHideModal()
      Linking.openSettings()
    }
  }, [onHideModal])

  const dismissNotifications = useCallback(() => {
    analytics.logDismissNotifications()
    onHideModal()
  }, [onHideModal])

  return (
    <AppInformationModal
      title="Les bons plans au bon moment&nbsp;!"
      onCloseIconPress={dismissNotifications}
      visible={visible}>
      <Spacer.Column numberOfSpaces={4} />
      <BicolorRingingBell />
      <Spacer.Column numberOfSpaces={4} />
      <StyledBody>
        Offres personnalisées, invitations spéciales, concours...
        {DOUBLE_LINE_BREAK}
        Reçois des notifications sur les bons plans du pass Culture en exclusivité&nbsp;!
      </StyledBody>
      <Spacer.Column numberOfSpaces={8} />
      <ButtonPrimary wording="Activer les notifications" onPress={acceptNotifications} />
    </AppInformationModal>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
