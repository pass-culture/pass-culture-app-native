import React from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { getProfileHookConfig } from 'features/navigation/ProfileStackNavigator/getProfileHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { getSiteMapLinks } from 'features/profile/helpers/getSiteMapLinks'
import { useSortedSearchCategories } from 'features/search/helpers/useSortedSearchCategories/useSortedSearchCategories'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { getLineHeightPx } from 'libs/parsers/getLineHeightPx'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Li } from 'ui/components/Li'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { Dot } from 'ui/svg/icons/Dot'

export function SiteMapScreen() {
  const { goBack } = useGoBack(...getProfileHookConfig('Accessibility'))
  const { isLoggedIn } = useAuthContext()
  const sortedCategories = useSortedSearchCategories()
  const siteMapLinks = getSiteMapLinks(sortedCategories)

  const visibleSiteMapLinks = siteMapLinks.filter(
    ({ isLoggedIn: required }) => !required || isLoggedIn
  )

  return (
    <SecondaryPageWithBlurHeader title="Plan du site" enableMaxWidth={false} onGoBack={goBack}>
      <StyledVerticalUl>
        {visibleSiteMapLinks.map((item, parentIndex) => {
          const visibleSubPages = item.subPages.filter(
            (subPage) => !subPage.isLoggedIn || isLoggedIn
          )

          const parentJsx = (
            <Li
              key={item.wording}
              groupLabel="Plan du site"
              total={visibleSiteMapLinks.length}
              index={parentIndex}
              accessibilityLabel={item.wording}
              accessibilityRole={AccessibilityRole.BUTTON}>
              <ItemContainer>
                <BulletContainer>
                  <Bullet />
                </BulletContainer>
                <ListText>
                  <InternalTouchableLink
                    as={ButtonTertiaryBlack}
                    wording={item.wording}
                    navigateTo={item.navigateTo}
                    justifyContent="flex-start"
                  />
                </ListText>
              </ItemContainer>
            </Li>
          )

          const childrenJsx = visibleSubPages.map((subPage, subIndex) => (
            <Li
              key={subPage.wording}
              groupLabel={item.wording}
              index={subIndex}
              total={visibleSubPages.length}
              accessibilityLabel={subPage.wording}
              accessibilityRole={AccessibilityRole.BUTTON}>
              <NestedItemContainer>
                <BulletContainer>
                  <NestedBullet />
                </BulletContainer>
                <ListText>
                  <InternalTouchableLink
                    as={ButtonTertiaryBlack}
                    wording={subPage.wording}
                    navigateTo={subPage.navigateTo}
                    justifyContent="flex-start"
                  />
                </ListText>
              </NestedItemContainer>
            </Li>
          ))

          return [parentJsx, ...childrenJsx]
        })}
      </StyledVerticalUl>
    </SecondaryPageWithBlurHeader>
  )
}

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

const StyledVerticalUl = styled(VerticalUl)({
  width: '100%',
})
