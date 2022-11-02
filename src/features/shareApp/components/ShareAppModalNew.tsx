import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { shareApp } from 'features/shareApp/helpers/shareApp'
import {
  shareAppModalInformations,
  ShareAppModalType,
} from 'features/shareApp/helpers/shareAppModalInformations'
import { analytics } from 'libs/firebase/analytics'
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
  const openShareAppModal = useCallback(() => {
    analytics.logShareApp(modalType)
    hideModal()
    setTimeout(shareApp, 0)
  }, [modalType, hideModal])

  const onCloseIconPress = useCallback(() => {
    analytics.logDismissShareApp(modalType)
    hideModal()
  }, [modalType, hideModal])

  const { title, explanation } = shareAppModalInformations(modalType)

  return (
    <AppInformationModal visible={visible} title={title} onCloseIconPress={onCloseIconPress}>
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
