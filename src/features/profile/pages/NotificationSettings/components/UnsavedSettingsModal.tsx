import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { AppModal } from 'ui/components/modals/AppModal'
import { Close } from 'ui/svg/icons/Close'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { getSpacing, Spacer, Typo } from 'ui/theme'

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
  const { goBack: goBackAndLeaveNotificationSettings } = useGoBack(...getTabNavConfig('Profile'))

  return (
    <AppModal
      animationOutTiming={1}
      visible={visible}
      title="Quitter sans enregistrer&nbsp;?"
      rightIconAccessibilityLabel="Ne pas quitter"
      rightIcon={Close}
      onRightIconPress={dismissModal}>
      <ModalContent>
        <Spacer.Column numberOfSpaces={2} />
        <InformationText>Tes modifications ne seront pas prises en compte.</InformationText>
        <Spacer.Column numberOfSpaces={8} />
        <ButtonPrimary
          wording="Enregistrer mes modifications"
          onPress={() => {
            onPressSaveChanges()
            dismissModal()
            goBackAndLeaveNotificationSettings()
          }}
        />
        <Spacer.Column numberOfSpaces={5} />
        <ButtonTertiaryBlack
          wording="Quitter sans enregistrer"
          onPress={() => {
            dismissModal()
            goBackAndLeaveNotificationSettings()
          }}
          icon={Invalidate}
        />
        <Spacer.Column numberOfSpaces={1} />
      </ModalContent>
    </AppModal>
  )
}

const InformationText = styled(Typo.Body)({
  textAlign: 'center',
})

const ModalContent = styled.View({
  paddingHorizontal: getSpacing(5.5),
  width: '100%',
})
