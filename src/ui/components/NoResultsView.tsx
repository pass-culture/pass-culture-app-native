import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { getSearchPropConfig } from 'features/navigation/SearchStackNavigator/getSearchPropConfig'
import { useLogBeforeNavToSearchResults } from 'features/search/helpers/useLogBeforeNavToSearchResults/useLogBeforeNavToSearchResults'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
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
        {Icon ? (
          <Icon color={designSystem.color.icon.subtle} size={illustrations.sizes.fullPage} />
        ) : null}
        <StyledBody>{explanations}</StyledBody>
        {offline ? null : (
          <ButtonContainer>
            <InternalTouchableLink
              as={ButtonPrimary}
              navigateTo={getSearchPropConfig('SearchLanding')}
              wording="Découvrir le catalogue"
              onBeforeNavigate={onPressExploreOffers}
              buttonHeight="tall"
              icon={MagnifyingGlass}
            />
          </ButtonContainer>
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

const ButtonContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
  marginTop: theme.designSystem.size.spacing.s,
  width: '100%',
}))
