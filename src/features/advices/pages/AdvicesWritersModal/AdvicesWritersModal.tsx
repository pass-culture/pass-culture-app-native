import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useMobileFontScaleToDisplay } from 'shared/accessibility/helpers/zoomHelpers'
import { remoteIllustrationUrls } from 'shared/illustrations/remoteIllustrations'
import { AppModal } from 'ui/components/modals/AppModal'
import { RemoteIllustration } from 'ui/components/RemoteIllustration'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { Close } from 'ui/svg/icons/Close'
import { Typo } from 'ui/theme'

type Props = {
  isVisible: boolean
  closeModal: VoidFunction
  onButtonPress: VoidFunction
  modalWording: string
  buttonWording: string
}

export const AdvicesWritersModal: FunctionComponent<Props> = ({
  isVisible,
  closeModal,
  onButtonPress,
  modalWording,
  buttonWording,
}) => {
  const isZoomed = useMobileFontScaleToDisplay({ default: false, at200PercentZoom: true })
  const enableNewVisionUi = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_VISION_UI)

  return (
    <AppModal
      animationOutTiming={1}
      visible={isVisible}
      title={'Qui écrit les avis\u00a0?'}
      rightIconAccessibilityLabel="Fermer la modale"
      rightIcon={Close}
      isUpToStatusBar={isZoomed}
      onRightIconPress={closeModal}>
      <ViewGap gap={6}>
        {enableNewVisionUi ? (
          <IllustrationContainer>
            <RemoteIllustration
              url={remoteIllustrationUrls.questioningKnightSmall}
              backgroundColor="information03"
              size="s"
            />
          </IllustrationContainer>
        ) : null}
        <Typo.Body>{modalWording}</Typo.Body>

        <Button wording={buttonWording} onPress={onButtonPress} color="brand" />
      </ViewGap>
    </AppModal>
  )
}

const IllustrationContainer = styled.View({
  alignItems: 'center',
})
