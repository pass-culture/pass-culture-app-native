import React from 'react'
import { Platform } from 'react-native'

import { BUTTON_TEXT_SCREEN, DESCRIPTION, TITLE } from 'features/forceUpdate/constants'
import { onPressStoreLink } from 'features/forceUpdate/helpers/onPressStoreLink'
import { WEBAPP_V2_URL } from 'libs/environment/useWebAppUrl'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { remoteIllustrationUrls } from 'shared/illustrations/remoteIllustrations'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { Button } from 'ui/designSystem/Button/Button'
import { GenericErrorPage } from 'ui/pages/GenericErrorPage'
import { AgainIllustration } from 'ui/svg/icons/AgainIllustration'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'

const isWeb = Platform.OS === 'web'

// NEVER EVER USE NAVIGATION (OR ANYTHING FROM @react-navigation)
// ON THIS PAGE OR IT WILL BREAK!!!
// THE NAVIGATION CONTEXT IS NOT ALWAYS LOADED WHEN WE DISPLAY
// EX: ScreenErrorProvider IS OUTSIDE NAVIGATION!
export const ForceUpdateInfos = () => {
  const enableNewVisionUi = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_VISION_UI)

  const buttonTertiaryWithNav = isWeb ? undefined : (
    <ExternalTouchableLink
      key={2}
      as={Button}
      variant="tertiary"
      color="neutral"
      wording="Utiliser la version web"
      externalNav={{ url: WEBAPP_V2_URL }}
      icon={ExternalSiteFilled}
    />
  )

  return (
    <GenericErrorPage
      helmetTitle={TITLE}
      illustration={AgainIllustration}
      remoteIllustration={
        enableNewVisionUi
          ? {
              url: remoteIllustrationUrls.mobileDeviceAndParameters,
              backgroundColor: 'pending01',
            }
          : undefined
      }
      title={TITLE}
      subtitle={DESCRIPTION}
      buttonPrimary={{ wording: BUTTON_TEXT_SCREEN, onPress: onPressStoreLink }}
      buttonTertiaryExternalNav={buttonTertiaryWithNav}
    />
  )
}
