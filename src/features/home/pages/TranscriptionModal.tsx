import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import { styled } from 'styled-components/native'

import { AppModal } from 'ui/components/modals/AppModal'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { Close } from 'ui/svg/icons/Close'
import { Typo } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

type Props = {
  isVisible: boolean
  closeModal: VoidFunction
  title: string
  transcription: string
}

export const TranscriptionModal: FunctionComponent<Props> = ({
  isVisible,
  closeModal,
  title,
  transcription,
}) => {
  const { top } = useCustomSafeInsets()

  return (
    <AppModal
      animationOutTiming={1}
      visible={isVisible}
      title="Transcription"
      rightIconAccessibilityLabel="Fermer la modale"
      rightIcon={Close}
      onRightIconPress={closeModal}
      customModalHeader={
        <ModalHeaderContainer>
          <View style={{ height: top }} />
          <ModalHeader
            title="Transcription"
            rightIconAccessibilityLabel="Fermer la modale"
            rightIcon={Close}
            onRightIconPress={closeModal}
          />
        </ModalHeaderContainer>
      }
      fixedModalBottom={
        <BottomWrapper>
          <Button wording="Fermer" onPress={closeModal} color="brand" fullWidth />
        </BottomWrapper>
      }
      isFullscreen
      noPadding>
      <Container>
        <ViewGap gap={4}>
          <Typo.Title3>{title}</Typo.Title3>
          <Typo.BodyS>{transcription}</Typo.BodyS>
        </ViewGap>
      </Container>
    </AppModal>
  )
}

const Container = styled.View(({ theme }) => ({
  paddingHorizontal: theme.modal.spacing.MD,
}))

const ModalHeaderContainer = styled.View(({ theme }) => ({
  width: '100%',
  paddingHorizontal: theme.designSystem.size.spacing.xl,
  marginVertical: theme.designSystem.size.spacing.xl,
}))

const BottomWrapper = styled.View(({ theme }) => ({
  paddingTop: theme.designSystem.size.spacing.l,
  paddingHorizontal: theme.modal.spacing.MD,
  alignItems: 'center',
}))
