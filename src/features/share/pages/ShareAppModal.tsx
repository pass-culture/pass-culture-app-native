import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { SHARE_APP_IMAGE_SOURCE } from 'features/share/components/shareAppImage'
import { shareApp } from 'features/share/helpers/shareApp'
import {
  shareAppModalInformations,
  ShareAppModalType,
} from 'features/share/helpers/shareAppModalInformations'
import { analytics } from 'libs/firebase/analytics'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { MarketingModal } from 'ui/components/modals/MarketingModal'
import { Share } from 'ui/svg/icons/BicolorShare'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { Spacer, Typo } from 'ui/theme'

type Props = {
  visible: boolean
  hideModal: () => void
  modalType: ShareAppModalType
}

export const ShareAppModal: FunctionComponent<Props> = ({ visible, hideModal, modalType }) => {
  const openShareAppModal = useCallback(() => {
    analytics.logShareApp(modalType)
    hideModal()
    setTimeout(shareApp, 0)
  }, [modalType, hideModal])

  const closeModal = useCallback(() => {
    analytics.logDismissShareApp(modalType)
    hideModal()
  }, [modalType, hideModal])

  const { title, explanation } = shareAppModalInformations(modalType)

  return (
    <MarketingModal
      visible={visible}
      title={title}
      imageSource={SHARE_APP_IMAGE_SOURCE}
      onBackdropPress={closeModal}>
      <StyledBody>{explanation}</StyledBody>
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

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const ButtonContainer = styled.View({ width: '100%' })
