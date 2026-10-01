import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { remoteIllustrationUrls } from 'shared/illustrations/remoteIllustrations'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { Offers } from 'ui/svg/icons/Offers'
import { LINE_BREAK } from 'ui/theme/constants'

export const VerticalPlaylistError = () => {
  const { goBack } = useNavigation<UseNavigationType>()
  const enableNewVisionUi = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_VISION_UI)

  return (
    <GenericInfoPage
      illustration={Offers}
      title="Oups&nbsp;!"
      subtitle={`Une erreur est survenue.${LINE_BREAK}Veuillez réessayer plus tard.`}
      buttonPrimary={{ wording: 'Retourner à la page précédente', onPress: goBack }}
      remoteIllustration={
        enableNewVisionUi
          ? {
              url: remoteIllustrationUrls.brokenDinosaurSkeletonLarge,
              backgroundColor: 'negative01',
            }
          : undefined
      }
    />
  )
}
