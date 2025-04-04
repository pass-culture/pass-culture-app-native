import React from 'react'
import { Platform } from 'react-native'

import { BUTTON_TEXT_SCREEN, DESCRIPTION, TITLE } from 'features/forceUpdate/constants'
import { onPressStoreLink } from 'features/forceUpdate/helpers/onPressStoreLink'
import { WEBAPP_V2_URL } from 'libs/environment/useWebAppUrl'
import { GenericErrorPage } from 'ui/pages/GenericErrorPage'
import { AgainIllustration } from 'ui/svg/icons/AgainIllustration'

const isWeb = Platform.OS === 'web'

// NEVER EVER USE NAVIGATION (OR ANYTHING FROM @react-navigation)
// ON THIS PAGE OR IT WILL BREAK!!!
// THE NAVIGATION CONTEXT IS NOT ALWAYS LOADED WHEN WE DISPLAY
// EX: ScreenErrorProvider IS OUTSIDE NAVIGATION !
export const ForceUpdateInfos = () => {
  const buttonTertiaryInfos = isWeb
    ? undefined
    : { wording: 'Utiliser la version web', externalNav: { url: WEBAPP_V2_URL } }

  return (
    <GenericErrorPage
      helmetTitle={TITLE}
      illustration={AgainIllustration}
      title={TITLE}
      subtitle={DESCRIPTION}
      buttonPrimary={{ wording: BUTTON_TEXT_SCREEN, onPress: onPressStoreLink }}
      buttonTertiary={buttonTertiaryInfos}
    />
  )
}
