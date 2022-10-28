import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import {
  shareAppModalInformations,
  ShareAppModalType,
} from 'libs/share/shareApp/shareAppModalInformations'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { BicolorShout } from 'ui/svg/icons/BicolorShout'
import { Spacer, Typo } from 'ui/theme'

type Props = {
  visible: boolean
  hideModal: () => void
  modalType: ShareAppModalType
}

export const ShareAppModalNew: FunctionComponent<Props> = ({ visible, hideModal, modalType }) => {
  const openShareAppModal = async () => {
    hideModal()
  }
  const { title, explanation } = shareAppModalInformations(modalType)

  return (
    <AppInformationModal visible={visible} title={title} onCloseIconPress={hideModal}>
      <ShoutIcon />
      <Spacer.Column numberOfSpaces={6} />
      <StyledBody>{explanation}</StyledBody>
      <Spacer.Column numberOfSpaces={6} />
      <ButtonPrimary
        wording="Partager"
        accessibilityLabel="Partager l'application"
        onPress={openShareAppModal}
      />
    </AppInformationModal>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const ShoutIcon = styled(BicolorShout).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.fullPage,
}))``
