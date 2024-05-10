import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { SHARE_APP_IMAGE_SOURCE } from 'features/share/components/shareAppImage'
import { shareApp } from 'features/share/helpers/shareApp'
import { shareAppModalInformations } from 'features/share/helpers/shareAppModalInformation'
import { ShareAppModalType } from 'features/share/types'
import { analytics } from 'libs/analytics'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { MarketingModal } from 'ui/components/modals/MarketingModal'
import { Share } from 'ui/svg/icons/BicolorShare'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { Spacer } from 'ui/theme'

type Props = {
  visible: boolean
  hideModal: () => void
  modalType: ShareAppModalType
}

export const ShareAppModal: FunctionComponent<Props> = ({ visible, hideModal, modalType }) => {
  const { shareAppWordingVersion } = useRemoteConfigContext()

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

  const { title, subtitle } = shareAppModalInformations(shareAppWordingVersion)

  return (
    <MarketingModal
      visible={visible}
      title={title}
      imageSource={SHARE_APP_IMAGE_SOURCE}
      onBackdropPress={closeModal}>
      {subtitle}
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
