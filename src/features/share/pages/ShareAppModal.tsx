import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { SHARE_APP_IMAGE_SOURCE } from 'features/share/components/shareAppImage'
import { shareApp } from 'features/share/helpers/shareApp'
import { ShareAppModalType } from 'features/share/types'
import { analytics } from 'libs/analytics'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { MarketingModal } from 'ui/components/modals/MarketingModal'
import { Share } from 'ui/svg/icons/BicolorShare'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { Spacer, Typo } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'

type Props = {
  visible: boolean
  hideModal: () => void
  modalType: ShareAppModalType
}

export const ShareAppModal: FunctionComponent<Props> = ({ visible, hideModal, modalType }) => {
  const openShareAppModal = useCallback(() => {
    analytics.logShareApp({ type: modalType })
    hideModal()
    const utmMedium =
      modalType === ShareAppModalType.BENEFICIARY ? 'beneficiary_modal' : 'uneligible_modal'
    setTimeout(() => shareApp(utmMedium), 0)
  }, [modalType, hideModal])

  const closeModal = useCallback(() => {
    analytics.logDismissShareApp(modalType)
    hideModal()
  }, [modalType, hideModal])

  return (
    <MarketingModal
      visible={visible}
      title={'Fais tourner le bon plan\u00a0!'}
      imageSource={SHARE_APP_IMAGE_SOURCE}
      onBackdropPress={closeModal}>
      <StyledBody>
        <Typo.ButtonText>
          35&nbsp;% des jeunes en France n’ont pas encore le pass Culture.
        </Typo.ButtonText>
        {LINE_BREAK}
        Fais découvrir le pass à tes amis&nbsp;!
      </StyledBody>
      <Spacer.Column numberOfSpaces={6} />
      <ButtonContainer>
        <ButtonWithLinearGradient
          wording="Partager l’appli"
          icon={Share}
          onPress={openShareAppModal}
        />
        <Spacer.Column numberOfSpaces={4} />
        <ButtonQuaternaryBlack
          wording="Non merci"
          accessibilityLabel="Fermer la modale"
          icon={Invalidate}
          onPress={closeModal}
        />
      </ButtonContainer>
    </MarketingModal>
  )
}

const ButtonContainer = styled.View({ width: '100%' })
const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
