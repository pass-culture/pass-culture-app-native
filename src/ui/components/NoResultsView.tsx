import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { getSearchPropConfig } from 'features/navigation/SearchStackNavigator/getSearchPropConfig'
import { useLogBeforeNavToSearchResults } from 'features/search/helpers/useLogBeforeNavToSearchResults/useLogBeforeNavToSearchResults'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Typo } from 'ui/theme'

type Props = {
  explanations: string
  icon: FunctionComponent<AccessibleIcon>
  trackingExplorerOffersFrom: 'bookings' | 'favorites'
  title?: string
  offline?: boolean
}

export const NoResultsView = ({
  title,
  explanations,
  icon: Icon,
  offline = false,
  trackingExplorerOffersFrom,
  ...props
}: Props) => {
  const { illustrations, designSystem } = useTheme()
  const onPressExploreOffers = useLogBeforeNavToSearchResults({ from: trackingExplorerOffersFrom })

  return (
    <React.Fragment>
      {title ? (
        <Container>
          <CaptionTitle>{title}</CaptionTitle>
        </Container>
      ) : null}
      <ContentContainer gap={4} {...props}>
        <ContainerText>
          {Icon ? (
            <Icon color={designSystem.color.icon.subtle} size={illustrations.sizes.fullPage} />
          ) : null}
          <StyledBody>{explanations}</StyledBody>
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

const ContentContainer = styled(ViewGap)(({ theme }) => ({
  height: '100%',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  paddingBottom: theme.tabBar.height,
  paddingHorizontal: theme.contentPage.marginHorizontal,
}))

const CaptionTitle = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  maxWidth: theme.contentPage.maxWidth,
  textAlign: 'center',
}))

const ContainerText = styled.View(({ theme }) => ({
  alignItems: 'center',
  marginBottom: theme.designSystem.size.spacing.l,
  maxWidth: theme.isDesktopViewport ? theme.contentPage.maxWidth : undefined,
}))
