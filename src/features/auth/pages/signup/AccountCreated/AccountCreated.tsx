import React, { useCallback, useEffect } from 'react'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { useShareAppContext } from 'features/share/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/share/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { BatchEvent, BatchProfile } from 'libs/react-native-batch'
import { remoteIllustrationUrls } from 'shared/illustrations/remoteIllustrations'
import QpiThanks from 'ui/animations/qpi_thanks.json'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'

export function AccountCreated() {
  const enableNewVisionUi = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_VISION_UI)

  useEffect(() => {
    void BatchProfile.trackEvent(BatchEvent.screenViewAccountCreated)
  }, [])

  const { showShareAppModal } = useShareAppContext()

  const onBeforeNavigate = useCallback(() => {
    void BatchProfile.trackEvent(BatchEvent.hasValidatedAccount)
    showShareAppModal(ShareAppModalType.NOT_ELIGIBLE)
  }, [showShareAppModal])

  return (
    <GenericInfoPage
      animation={QpiThanks}
      animationColoringMode="targeted"
      animationTargetShapeNames={['Fond 1', 'Gradient Fill 1']}
      animationTargetLayerNames={['étoile', 'cadre']}
      remoteIllustration={
        enableNewVisionUi
          ? { url: remoteIllustrationUrls.thumbUpKnightLarge, backgroundColor: 'positive01' }
          : undefined
      }
      title="Ton compte a été activé&nbsp;!"
      subtitle=""
      buttonPrimary={{
        wording: 'On y va\u00a0!',
        onBeforeNavigate,
        navigateTo: navigateToHomeConfig,
      }}></GenericInfoPage>
  )
}
