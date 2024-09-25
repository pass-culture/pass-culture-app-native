import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { useAchievementDetails } from 'features/profile/pages/Achievements/useAchievementDetails'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { Spacer } from 'ui/components/spacer/Spacer'
import { Accordion } from 'ui/svg/icons/bicolor/Accordion'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { TypoDS } from 'ui/theme'

interface Props {
  visible: boolean
  hideModal: () => void
  id: string
}

export const AchievementSuccessModal: FunctionComponent<Props> = ({ visible, hideModal, id }) => {
  const achievement = useAchievementDetails(id)

  return (
    <AppInformationModal
      title="Félicitations&nbsp;!"
      onCloseIconPress={hideModal}
      visible={visible}>
      <Spacer.Column numberOfSpaces={4} />
      <Icon />
      <Spacer.Column numberOfSpaces={4} />
      <TypoDS.Body>{achievement?.name}</TypoDS.Body>
      <Spacer.Column numberOfSpaces={20} />
      <ButtonPrimary wording="Accéder à mes succès" />
      <Spacer.Column numberOfSpaces={4} />
      <ButtonQuaternaryBlack
        wording="Fermer"
        accessibilityLabel="Fermer la modale"
        icon={Invalidate}
        onPress={hideModal}
      />
    </AppInformationModal>
  )
}

const Icon = styled(Accordion).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.fullPage,
}))``
