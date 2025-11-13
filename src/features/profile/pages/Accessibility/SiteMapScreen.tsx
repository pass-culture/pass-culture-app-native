import React from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { getProfileHookConfig } from 'features/navigation/ProfileStackNavigator/getProfileHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { getSiteMapLinks } from 'features/profile/helpers/getSiteMapLinks'
import { SiteMapScreenContent } from 'features/profile/pages/Accessibility/SiteMapScreenContent'
import { useSortedSearchCategories } from 'features/search/helpers/useSortedSearchCategories/useSortedSearchCategories'
import { getLineHeightPx } from 'libs/parsers/getLineHeightPx'
import { AppButton } from 'ui/components/buttons/AppButton/AppButton'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { Dot } from 'ui/svg/icons/Dot'
import { Typo } from 'ui/theme'

export const SiteMapScreen = () => {
  const { goBack } = useGoBack(...getProfileHookConfig('Accessibility'))
  const { isLoggedIn } = useAuthContext()
  const sortedCategories = useSortedSearchCategories()
  const siteMapLinks = getSiteMapLinks(sortedCategories)

  const visibleSiteMapLinks = siteMapLinks.filter(
    ({ isLoggedIn: required }) => !required || isLoggedIn
  )

  return (
    <SecondaryPageWithBlurHeader title="Plan du site" enableMaxWidth={false} onGoBack={goBack}>
      <SiteMapScreenContent visibleSiteMapLinks={visibleSiteMapLinks} isLoggedIn={isLoggedIn} />
    </SecondaryPageWithBlurHeader>
  )
}

export const ParentListItem = ({ wording, navigateTo }) => {
  return (
    <ItemContainer>
      <BulletContainer>
        <Bullet />
      </BulletContainer>
      <ListText>
        <InternalTouchableLink as={Button} wording={wording} navigateTo={navigateTo} />
      </ListText>
    </ItemContainer>
  )
}

export const SubPagesListItem = ({ wording, navigateTo }) => {
  return (
    <NestedItemContainer>
      <BulletContainer>
        <NestedBullet />
      </BulletContainer>
      <ListText>
        <InternalTouchableLink
          as={Button}
          typography="BodyAccentXs"
          wording={wording}
          navigateTo={navigateTo}
        />
      </ListText>
    </NestedItemContainer>
  )
}
export const StyledVerticalUl = styled(VerticalUl)({
  width: '100%',
})

const Button = styledButton(AppButton).attrs<BaseButtonProps>(({ theme }) => {
  const Title = styled(Typo.Button)({
    color: theme.designSystem.color.text.default,
  })

  return {
    title: Title,
    justifyContent: 'flex-start',
    hoverUnderlineColor: theme.designSystem.color.text.default,
  }
})``

const ItemContainer = styled.View<{ spacing?: number }>(({ theme }) => ({
  flexDirection: 'row',
  marginLeft: theme.designSystem.size.spacing.m,
}))

const NestedItemContainer = styled.View<{ spacing?: number }>(({ theme }) => ({
  flexDirection: 'row',
  marginLeft: theme.designSystem.size.spacing.xxl,
}))

const Bullet = styled(Dot).attrs({
  size: 3,
})``

const NestedBullet = styled(Dot).attrs(({ theme }) => ({
  size: 3,
  fillColor: theme.designSystem.color.icon.lockedInverted,
}))``

const BulletContainer = styled.View(({ theme }) => ({
  height: getLineHeightPx(theme.designSystem.typography.body.lineHeight, theme.isDesktopViewport),
  justifyContent: 'center',
  alignSelf: 'center',
}))

const ListText = styled.View(({ theme }) => ({
  marginLeft: theme.designSystem.size.spacing.m,
  flex: 1,
}))
