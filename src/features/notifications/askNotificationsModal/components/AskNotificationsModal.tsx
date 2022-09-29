import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

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
  return (
    <AppInformationModal
      title={'Les bons plans au bon moment\u00a0!'}
      onCloseIconPress={onHideModal}
      visible={visible}>
      <BicolorRingingBell />
      <Spacer.Column numberOfSpaces={4} />
      <StyledBody>
        {`Offres personnalisées, invitations spéciales, concours...`}
        {DOUBLE_LINE_BREAK}
        {`Reçois des notifications sur les bons plans du pass Culture en exclusivité\u00a0!`}
      </StyledBody>
      <Spacer.Column numberOfSpaces={8} />
      <ButtonPrimary wording="Activer les notifications" />
    </AppInformationModal>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
