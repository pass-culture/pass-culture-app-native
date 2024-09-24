import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { Spacer } from 'ui/components/spacer/Spacer'
import { BicolorLogo } from 'ui/svg/icons/BicolorLogo'

interface Props {
  visible: boolean
  onHideModal: () => void
}

export const AchievementsModal: FunctionComponent<Props> = ({ visible, onHideModal }) => {
  return (
    <AppInformationModal
      title="Félicitations&nbsp;!"
      onCloseIconPress={onHideModal}
      visible={visible}>
      <Spacer.Column numberOfSpaces={4} />
      <Icon />
      <Spacer.Column numberOfSpaces={4} />
      <ButtonPrimary wording="Accéder à mes succès" />
    </AppInformationModal>
  )
}

const Icon = styled(BicolorLogo).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.fullPage,
}))``
