import React from 'react'
import { Helmet } from 'react-helmet'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { BUTTON_TEXT_SCREEN, DESCRIPTION, TITLE } from 'features/forceUpdate/constants'
import { onPressStoreLink } from 'features/forceUpdate/helpers/onPressStoreLink'
import { WEBAPP_V2_URL } from 'libs/environment'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { AgainIllustration } from 'ui/svg/icons/AgainIllustration'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { TypoDS } from 'ui/theme'

const isWeb = Platform.OS === 'web'

export const ForceUpdateInfos = () => (
  <React.Fragment>
    <Helmet>
      <title>{TITLE}</title>
    </Helmet>
    <GenericInfoPage
      title={TITLE}
      icon={AgainIllustration}
      buttons={[
        <ButtonPrimaryWhite
          key={BUTTON_TEXT_SCREEN}
          wording={BUTTON_TEXT_SCREEN}
          onPress={onPressStoreLink}
        />,
        isWeb ? null : (
          <ExternalTouchableLink
            as={ButtonTertiaryWhite}
            wording="Utiliser la version web"
            externalNav={{ url: WEBAPP_V2_URL }}
            icon={ExternalSiteFilled}
          />
        ),
      ]}>
      <StyledBody>{DESCRIPTION}</StyledBody>
    </GenericInfoPage>
  </React.Fragment>
)

const StyledBody = styled(TypoDS.Body)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.white,
}))
