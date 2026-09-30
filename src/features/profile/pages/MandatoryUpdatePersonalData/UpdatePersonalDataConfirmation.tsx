import React from 'react'

import { useNavigateToHomeWithReset } from 'features/navigation/helpers/useNavigateToHomeWithReset'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { remoteIllustrationUrls } from 'shared/illustrations/remoteIllustrations'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { HappyFace } from 'ui/svg/icons/HappyFace'

export const UpdatePersonalDataConfirmation = () => {
  const { navigateToHomeWithReset } = useNavigateToHomeWithReset()
  const enableNewVisionUi = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_VISION_UI)
  return (
    <GenericInfoPage
      illustration={HappyFace}
      title="C’est noté&nbsp;!"
      subtitle="Merci, tes informations ont bien été prises en compte."
      buttonPrimary={{
        wording: 'Terminer',
        onPress: navigateToHomeWithReset,
      }}
      remoteIllustration={
        enableNewVisionUi
          ? {
              url: remoteIllustrationUrls.thumbUpKnightLarge,
              backgroundColor: 'positive01',
            }
          : undefined
      }
    />
  )
}
