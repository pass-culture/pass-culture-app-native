import React from 'react'
import { Helmet } from 'react-helmet'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { BUTTON_TEXT, DESCRIPTION, STORE_LINK, TITLE } from 'features/forceUpdate/constants'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { analytics } from 'libs/analytics'
import { WEBAPP_V2_URL } from 'libs/environment'
import { getAppBuildVersion } from 'libs/packageJson'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { AgainIllustration } from 'ui/svg/icons/AgainIllustration'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { TypoDS } from 'ui/theme'

const isWeb = Platform.OS === 'web'

async function openStore() {
  await analytics.logClickForceUpdate(getAppBuildVersion())
  await openUrl(STORE_LINK)
}

const onPressStoreLink = Platform.select({
  default: () => {
    void (async () => {
      await openStore()
    })()
  },
  web: () => globalThis?.window?.location?.reload(),
})

export const ForceUpdateInfos = () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <GenericInfoPage
        title={TITLE}
        icon={AgainIllustration}
        buttons={[
          <ButtonPrimaryWhite key={BUTTON_TEXT} wording={BUTTON_TEXT} onPress={onPressStoreLink} />,
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
}

const StyledBody = styled(TypoDS.Body)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.white,
}))
