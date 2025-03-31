import React from 'react'
import { Helmet } from 'react-helmet'
import { Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { BUTTON_TEXT_SCREEN, DESCRIPTION, TITLE } from 'features/forceUpdate/constants'
import { onPressStoreLink } from 'features/forceUpdate/helpers/onPressStoreLink'
import { WEBAPP_V2_URL } from 'libs/environment/useWebAppUrl'
import { getPrimaryIllustration } from 'shared/illustrations/getPrimaryIllustration'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Page } from 'ui/pages/Page'
import { AgainIllustration } from 'ui/svg/icons/AgainIllustration'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer, Typo, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const isWeb = Platform.OS === 'web'

// NEVER EVER USE NAVIGATION (OR ANYTHING FROM @react-navigation)
// ON THIS PAGE OR IT WILL BREAK!!!
// THE NAVIGATION CONTEXT IS NOT ALWAYS LOADED WHEN WE DISPLAY
// EX: ScreenErrorProvider IS OUTSIDE NAVIGATION !
// TODO(PC-35429): Create a new GenericErroPage template wihtout background and use in this page
export const ForceUpdateInfos = () => {
  const { isDesktopViewport } = useTheme()
  const Illustration = getPrimaryIllustration(AgainIllustration)

  return (
    <React.Fragment>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <Page>
        <Container>
          <Spacer.Flex flex={1} />
          <IllustrationContainer>{Illustration ? <Illustration /> : null}</IllustrationContainer>
          <TextContainer gap={4}>
            <StyledTitle2 {...getHeadingAttrs(1)}>{TITLE}</StyledTitle2>
            <StyledBody {...getHeadingAttrs(2)}>{DESCRIPTION}</StyledBody>
          </TextContainer>
          {isDesktopViewport ? null : <Spacer.Flex flex={1} />}
          <ButtonContainer gap={4}>
            <ButtonPrimary key={1} wording={BUTTON_TEXT_SCREEN} onPress={onPressStoreLink} />
            {isWeb ? undefined : (
              <ExternalTouchableLink
                key={2}
                as={ButtonTertiaryBlack}
                wording="Utiliser la version web"
                externalNav={{ url: WEBAPP_V2_URL }}
                icon={ExternalSiteFilled}
              />
            )}
          </ButtonContainer>
          {isDesktopViewport ? <Spacer.Flex flex={1} /> : null}
        </Container>
      </Page>
    </React.Fragment>
  )
}

const Container = styled.View<{ top: number; bottom: number }>(({ theme }) => ({
  flex: 1,
  justifyContent: 'space-between',
  paddingHorizontal: theme.contentPage.marginHorizontal,
  paddingVertical: theme.contentPage.marginVertical,
  overflow: 'scroll',
}))

const IllustrationContainer = styled.View<{ animation: boolean }>(({ animation }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: getSpacing(6),
  ...(animation && { height: '30%' }),
}))

const TextContainer = styled(ViewGap)({
  alignItems: 'center',
  marginBottom: getSpacing(6),
})

const StyledTitle2 = styled(Typo.Title2)({
  textAlign: 'center',
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const ButtonContainer = styled(ViewGap)({
  alignItems: 'center',
})
