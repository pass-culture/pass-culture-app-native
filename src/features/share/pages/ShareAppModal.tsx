import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { SHARE_APP_IMAGE_SOURCE } from 'features/share/components/shareAppImage'
import { MarketingModal } from 'ui/components/modals/MarketingModal'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { Share } from 'ui/svg/icons/Share'
import { Typo } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'

type Props = {
  visible: boolean
  close: () => void
  share: () => void
}

export const ShareAppModal: FunctionComponent<Props> = ({ visible, close, share }) => {
  return (
    <MarketingModal
      visible={visible}
      title="Fais tourner le bon plan&nbsp;!"
      imageSource={SHARE_APP_IMAGE_SOURCE}
      onBackdropPress={close}>
      <ViewGap gap={6}>
        <StyledBody>
          <Typo.BodyAccent>
            35 % des jeunes en France n’ont pas encore le pass Culture.
          </Typo.BodyAccent>
          {LINE_BREAK}
          Fais découvrir le pass à tes amis&nbsp;!
        </StyledBody>
        <ViewGap gap={4}>
          <Button fullWidth wording="Partager l’appli" icon={Share} onPress={share} />
          <Button
            fullWidth
            variant="tertiary"
            color="neutral"
            wording="Non merci"
            accessibilityLabel="Fermer la modale"
            icon={Invalidate}
            onPress={close}
          />
        </ViewGap>
      </ViewGap>
    </MarketingModal>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
