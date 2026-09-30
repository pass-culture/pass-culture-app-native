import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { getSearchPropConfig } from 'features/navigation/navigators/SearchStackNavigator/getSearchPropConfig'
import { useLogBeforeNavToSearchResults } from 'features/search/helpers/useLogBeforeNavToSearchResults/useLogBeforeNavToSearchResults'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Typo } from 'ui/theme'

type Props = {
  explanations: string
  icon?: FunctionComponent<AccessibleIcon>
  trackingExplorerOffersFrom: 'bookings' | 'favorites'
  title?: string
  offline?: boolean
  remoteIllustration?: React.ReactNode
}

export const NoResultsView = ({
  title,
  explanations,
  icon: Icon,
  offline = false,
  trackingExplorerOffersFrom,
  remoteIllustration,
  ...props
}: Props) => {
  const { illustrations, designSystem } = useTheme()
  const onPressExploreOffers = useLogBeforeNavToSearchResults({ from: trackingExplorerOffersFrom })
  const hasRemoteIllustration = !!remoteIllustration

  return (
    <React.Fragment>
      {title ? (
        <Container>
          <CaptionTitle>{title}</CaptionTitle>
        </Container>
      ) : null}
      <ContentContainer gap={6} hasRemoteIllustration={hasRemoteIllustration} {...props}>
        <ContainerText hasRemoteIllustration={hasRemoteIllustration}>
          {Icon ? (
            <Icon color={designSystem.color.icon.subtle} size={illustrations.sizes.fullPage} />
          ) : null}
          {remoteIllustration}
          <StyledBody hasRemoteIllustration={hasRemoteIllustration}>{explanations}</StyledBody>
        </ContainerText>
        {offline ? null : (
          <InternalTouchableLink
            as={Button}
            navigateTo={getSearchPropConfig('SearchLanding')}
            wording="Découvrir le catalogue"
            onBeforeNavigate={onPressExploreOffers}
            icon={MagnifyingGlass}
          />
        )}
      </ContentContainer>
    </React.Fragment>
  )
}

const Container = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))

const ContentContainer = styled(ViewGap)<{ hasRemoteIllustration: boolean }>(
  ({ theme, hasRemoteIllustration }) => ({
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: hasRemoteIllustration ? undefined : theme.tabBar.height,
    paddingHorizontal: theme.contentPage.marginHorizontal,
  })
)

const CaptionTitle = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const StyledBody = styled(Typo.Body)<{ hasRemoteIllustration: boolean }>(
  ({ theme, hasRemoteIllustration }) => ({
    maxWidth: theme.contentPage.maxWidth,
    textAlign: 'center',
    marginTop: hasRemoteIllustration ? theme.designSystem.size.spacing.xl : undefined,
  })
)

const ContainerText = styled.View<{ hasRemoteIllustration: boolean }>(
  ({ theme, hasRemoteIllustration }) => ({
    alignItems: 'center',
    marginBottom: hasRemoteIllustration ? undefined : theme.designSystem.size.spacing.l,
    maxWidth: theme.isDesktopViewport ? theme.contentPage.maxWidth : undefined,
  })
)
