import React from 'react'
import { Helmet } from 'react-helmet'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { BUTTON_TEXT_SCREEN, DESCRIPTION, TITLE } from 'features/forceUpdate/constants'
import { onPressStoreLink } from 'features/forceUpdate/helpers/onPressStoreLink'
import { WEBAPP_V2_URL } from 'libs/environment/useWebAppUrl'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { AgainIllustration } from 'ui/svg/icons/AgainIllustration'
import { Typo } from 'ui/theme'

const isWeb = Platform.OS === 'web'

export const ForceUpdateInfos = () => (
  <React.Fragment>
    <Helmet>
      <title>{TITLE}</title>
    </Helmet>
    <GenericInfoPageWhite
      illustration={AgainIllustration}
      title={TITLE}
      buttonPrimary={{
        wording: BUTTON_TEXT_SCREEN,
        onPress: onPressStoreLink,
      }}
      buttonTertiary={
        isWeb
          ? undefined
          : {
              wording: 'Utiliser la version web',
              externalNav: { url: WEBAPP_V2_URL },
            }
      }>
      <StyledBody>{DESCRIPTION}</StyledBody>
    </GenericInfoPageWhite>
  </React.Fragment>
)

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
