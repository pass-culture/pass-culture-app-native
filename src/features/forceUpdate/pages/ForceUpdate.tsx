import React, { useEffect } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { STORE_LINK, TITLE, BUTTON_TEXT, DESCRIPTION } from 'features/forceUpdate/constants'
import { useMinimalBuildNumber } from 'features/forceUpdate/helpers/useMinimalBuildNumber'
import { openUrl } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import { WEBAPP_V2_URL } from 'libs/environment/useWebAppUrl'
import { getAppBuildVersion } from 'libs/packageJson'
import { Helmet } from 'libs/react-helmet/Helmet'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { AgainIllustration } from 'ui/svg/icons/AgainIllustration'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Typo } from 'ui/theme'

type ForceUpdateProps = {
  resetErrorBoundary: () => void
}

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

const isWeb = Platform.OS === 'web'

export const ForceUpdate = ({ resetErrorBoundary }: ForceUpdateProps) => {
  const minimalBuildNumber = useMinimalBuildNumber()

  // This first hook will be like a componentWillUnmount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => resetErrorBoundary, [])

  // This one is for when minimalBuildNumber gets back to an older value
  useEffect(() => {
    // it must be false and not null (which means not fetched)
    if (!!minimalBuildNumber && getAppBuildVersion() >= minimalBuildNumber) {
      resetErrorBoundary()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minimalBuildNumber])

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
          !isWeb && (
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

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.white,
}))
