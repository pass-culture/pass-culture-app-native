import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { getTabHookConfig } from 'features/navigation/TabBar/getTabHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { AppModal } from 'ui/components/modals/AppModal'
import { Button } from 'ui/designSystem/Button/Button'
import { Close } from 'ui/svg/icons/Close'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { Typo } from 'ui/theme'

interface Props {
  visible: boolean
  dismissModal: () => void
  onPressSaveChanges: () => void
}

export const UnsavedSettingsModal: FunctionComponent<Props> = ({
  visible,
  dismissModal,
  onPressSaveChanges,
}) => {
  const { goBack: goBackAndLeaveNotificationsSettings } = useGoBack(...getTabHookConfig('Profile'))

  return (
    <AppModal
      animationOutTiming={1}
      visible={visible}
      title="Quitter sans enregistrer&nbsp;?"
      rightIconAccessibilityLabel="Ne pas quitter"
      rightIcon={Close}
      onRightIconPress={dismissModal}>
      <ModalContent>
        <InformationText>Tes modifications ne seront pas prises en compte.</InformationText>
        <Button
          wording="Enregistrer mes modifications"
          onPress={() => {
            onPressSaveChanges()
            dismissModal()
            goBackAndLeaveNotificationsSettings()
          }}
        />
        <Button
          variant="tertiary"
          color="neutral"
          wording="Quitter sans enregistrer"
          onPress={() => {
            dismissModal()
            goBackAndLeaveNotificationsSettings()
          }}
          icon={Invalidate}
        />
      </ModalContent>
    </AppModal>
  )
}

const InformationText = styled(Typo.Body)({
  textAlign: 'center',
})

const ModalContent = styled.View(({ theme }) => ({
  gap: theme.designSystem.size.spacing.xl,
  width: '100%',
}))
