import React, { FC } from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { AppModal } from 'ui/components/modals/AppModal'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Share } from 'ui/svg/icons/BicolorShare'
import { BicolorSharePhones } from 'ui/svg/icons/BicolorSharePhones'
import { Close } from 'ui/svg/icons/Close'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { TypoDS } from 'ui/theme'
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
          <TypoDS.Button>35 % des jeunes en France n’ont pas encore le pass Culture.</TypoDS.Button>
          {LINE_BREAK}
          Fais découvrir le pass à tes amis&nbsp;!
        </StyledBody>
        <ViewGap gap={2}>
          <ButtonPrimary wording="Partager l’app" icon={Share} onPress={share} />
          <ButtonTertiaryBlack wording="Non merci" icon={Invalidate} onPress={close} />
        </ViewGap>
      </ViewGap>
    </AppModal>
  )
}

const StyledBody = styled(TypoDS.Body)({
  textAlign: 'center',
})

const ImageContainer = styled.View({
  alignItems: 'center',
})

const Icon = styled(BicolorSharePhones).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.medium,
}))({})
