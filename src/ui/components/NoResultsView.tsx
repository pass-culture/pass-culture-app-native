import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { getNavigateToConfig } from 'features/navigation/SearchStackNavigator/helpers'
import { useLogBeforeNavToSearchResults } from 'features/search/helpers/useLogBeforeNavToSearchResults/useLogBeforeNavToSearchResults'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'

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
  icon,
  offline = false,
  trackingExplorerOffersFrom,
  ...props
}: Props) => {
  const onPressExploreOffers = useLogBeforeNavToSearchResults({ from: trackingExplorerOffersFrom })

  const Icon =
    !!icon &&
    styled(icon).attrs(({ theme }) => ({
      size: theme.illustrations.sizes.fullPage,
      color: theme.colors.greyMedium,
    }))``

  return (
    <React.Fragment>
      {title ? (
        <Container>
          <CaptionTitle>{title}</CaptionTitle>
        </Container>
      ) : null}
      <ContentContainer {...props}>
        {Icon ? <Icon /> : null}
        <Spacer.Column numberOfSpaces={4} />
        <StyledBody>{explanations}</StyledBody>
        <Spacer.Column numberOfSpaces={4} />
        {offline ? null : (
          <ButtonContainer>
            <InternalTouchableLink
              as={ButtonPrimary}
              navigateTo={getNavigateToConfig('SearchLanding')}
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

const ContentContainer = styled.View(({ theme }) => ({
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.tabBar.height,
  marginHorizontal: theme.contentPage.marginHorizontal,
}))

const CaptionTitle = styled(TypoDS.BodyAccentXs)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const StyledBody = styled(TypoDS.Body)(({ theme }) => ({
  maxWidth: theme.contentPage.maxWidth,
  textAlign: 'center',
}))

const ButtonContainer = styled.View({
  marginTop: getSpacing(2),
})
