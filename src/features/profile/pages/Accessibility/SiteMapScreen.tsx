import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { getSiteMapLinks } from 'features/profile/helpers/getSiteMapLinks'
import { useSortedSearchCategories } from 'features/search/helpers/useSortedSearchCategories/useSortedSearchCategories'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { getLineHeightPx } from 'libs/parsers/getLineHeightPx'
import { Li } from 'ui/components/Li'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalTouchableLinkProps } from 'ui/components/touchableLink/types'
import { VerticalUl } from 'ui/components/Ul'
import { Button } from 'ui/designSystem/Button/Button'
import { Link } from 'ui/designSystem/Link/Link'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Dot } from 'ui/svg/icons/Dot'

export function SiteMapScreen() {
  const { isLoggedIn } = useAuthContext()
  const sortedCategories = useSortedSearchCategories()
  const siteMapLinks = getSiteMapLinks(sortedCategories)

  const visibleSiteMapLinks = siteMapLinks.filter(
    ({ isLoggedIn: required }) => !required || isLoggedIn
  )

  return (
    <PageWithHeader
      title="Plan du site"
      shouldBeAlignedFlexStart
      scrollChildren={
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
                    <SiteMapLink wording={item.wording} navigateTo={item.navigateTo} />
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
                    <SiteMapLink wording={subPage.wording} navigateTo={subPage.navigateTo} />
                  </ListText>
                </NestedItemContainer>
              </Li>
            ))

            return [parentJsx, ...childrenJsx]
          })}
        </StyledVerticalUl>
      }
    />
  )
}

function SiteMapLink({
  wording,
  navigateTo,
}: {
  wording: string
  navigateTo: InternalTouchableLinkProps['navigateTo']
}) {
  if (Platform.OS === 'web') {
    return (
      <InternalTouchableLink
        as={Link}
        label={wording}
        color="neutral"
        size="small"
        navigateTo={navigateTo}
      />
    )
  }

  return (
    <InternalTouchableLink
      as={Button}
      variant="tertiary"
      color="neutral"
      wording={wording}
      navigateTo={navigateTo}
      justifyContent="flex-start"
    />
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
}))

const StyledVerticalUl = styled(VerticalUl)({
  alignItems: 'flex-start',
})
