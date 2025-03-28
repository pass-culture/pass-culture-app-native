import React from 'react'
import { Helmet } from 'react-helmet'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { BUTTON_TEXT_SCREEN, DESCRIPTION, TITLE } from 'features/forceUpdate/constants'
import { onPressStoreLink } from 'features/forceUpdate/helpers/onPressStoreLink'
import { WEBAPP_V2_URL } from 'libs/environment/useWebAppUrl'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { GenericInfoPageDeprecated } from 'ui/pages/GenericInfoPageDeprecated'
import { AgainIllustration } from 'ui/svg/icons/AgainIllustration'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Typo } from 'ui/theme'

const isWeb = Platform.OS === 'web'

export const ForceUpdateInfos = () => (
  <React.Fragment>
    <Helmet>
      <title>{TITLE}</title>
    </Helmet>
    <GenericInfoPageDeprecated
      title={TITLE}
      icon={AgainIllustration}
      buttons={[
        <ButtonPrimaryWhite key={1} wording={BUTTON_TEXT_SCREEN} onPress={onPressStoreLink} />,
        isWeb ? null : (
          <ExternalTouchableLink
            key={2}
            as={ButtonTertiaryWhite}
            wording="Utiliser la version web"
            externalNav={{ url: WEBAPP_V2_URL }}
            icon={ExternalSiteFilled}
          />
        ),
      ]}>
      <StyledBody>{DESCRIPTION}</StyledBody>
    </GenericInfoPageDeprecated>
  </React.Fragment>
)

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.white,
}))
