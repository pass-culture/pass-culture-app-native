import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { analytics } from 'libs/firebase/analytics'
import { theme } from 'theme'
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
  const acceptNotifications = useCallback(() => {
    analytics.logAcceptNotifications()
    onHideModal()
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
      <BicolorRingingBell size={theme.illustrations.sizes.fullPage} />
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
