import React, { FC } from 'react'
import styled from 'styled-components/native'

import { AppModal } from 'ui/components/modals/AppModal'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { Close } from 'ui/svg/icons/Close'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { Share } from 'ui/svg/icons/Share'
import { SharePhones } from 'ui/svg/icons/SharePhones'
import { Typo } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'

type Props = {
  visible: boolean
  close: () => void
  share: () => void
}

export const ShareAppModalVersionB: FC<Props> = ({ visible, close, share }) => {
  return (
    <AppModal
      visible={visible}
      title="La culture, ça se partage&nbsp;!"
      onModalHide={close}
      onRightIconPress={close}
      rightIcon={Close}
      rightIconAccessibilityLabel="Fermer la modale">
      <ViewGap gap={4}>
        <ImageContainer>
          <Icon />
        </ImageContainer>
        <StyledBody>
          <Typo.Button>
            35 % des jeunes en France n’ont pas encore le pass&nbsp;Culture.
          </Typo.Button>
          {LINE_BREAK}
          Fais découvrir le pass à tes amis&nbsp;!
        </StyledBody>
        <ViewGap gap={2}>
          <Button wording="Partager l’app" icon={Share} onPress={share} />
          <Button
            variant="tertiary"
            color="neutral"
            wording="Non merci"
            icon={Invalidate}
            onPress={close}
          />
        </ViewGap>
      </ViewGap>
    </AppModal>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const ImageContainer = styled.View({
  alignItems: 'center',
})

const Icon = styled(SharePhones).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.medium,
  color: theme.designSystem.color.icon.brandPrimary,
}))({})
