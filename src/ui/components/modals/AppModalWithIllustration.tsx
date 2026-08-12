import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import {
  useMobileFontScaleToDisplay,
  useNumberOfLine,
} from 'shared/accessibility/helpers/zoomHelpers'
import { AppModal } from 'ui/components/modals/AppModal'
import { RemoteIllustration, RemoteIllustrationProps } from 'ui/components/RemoteIllustration'
import { Close } from 'ui/svg/icons/Close'
import { AccessibleIcon } from 'ui/svg/icons/types'

type Props = {
  children: React.ReactNode
  visible: boolean
  title: string
  Illustration: React.FC<AccessibleIcon>
  hideModal: () => void
  onModalHide?: () => void
  remoteIllustration?: RemoteIllustrationProps
}

export const AppModalWithIllustration: FunctionComponent<Props> = ({
  visible,
  title,
  Illustration,
  hideModal,
  onModalHide,
  remoteIllustration,
  children,
}) => {
  const enableNewVisionUi = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_VISION_UI)

  const renderIllustration = () => {
    if (enableNewVisionUi && remoteIllustration) {
      return <RemoteIllustration {...remoteIllustration} size="s" />
    }
    return <Illustration />
  }

  return (
    <AppModal
      visible={visible}
      title={title}
      titleNumberOfLines={useNumberOfLine(2)}
      isFullscreen={useMobileFontScaleToDisplay({ default: false, at200PercentZoom: true })}
      rightIconAccessibilityLabel="Fermer la modale"
      rightIcon={Close}
      onRightIconPress={hideModal}
      onModalHide={onModalHide}>
      <Container>
        {renderIllustration()}
        <ChildrenWrapper>{children}</ChildrenWrapper>
      </Container>
    </AppModal>
  )
}
const Container = styled.View({
  alignItems: 'center',
  width: '100%',
})

const ChildrenWrapper = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xl,
  alignItems: 'center',
}))
