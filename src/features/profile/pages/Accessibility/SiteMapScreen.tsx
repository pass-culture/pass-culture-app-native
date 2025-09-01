import React from 'react'
import { FlatList } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { getProfileHookConfig } from 'features/navigation/ProfileStackNavigator/getProfileHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { SiteMap, getSiteMapLinks } from 'features/profile/helpers/getSiteMapLinks'
import { useSortedSearchCategories } from 'features/search/helpers/useSortedSearchCategories/useSortedSearchCategories'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { getLineHeightPx } from 'libs/parsers/getLineHeightPx'
import { AppButton } from 'ui/components/buttons/AppButton/AppButton'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Li } from 'ui/components/Li'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { Dot } from 'ui/svg/icons/Dot'
import { Typo, getSpacing } from 'ui/theme'

export function SiteMapScreen() {
  const { goBack } = useGoBack(...getProfileHookConfig('Accessibility'))
  const { isLoggedIn } = useAuthContext()
  const sortedCategories = useSortedSearchCategories()
  const siteMapLinks = getSiteMapLinks(sortedCategories)

  const visibleSiteMapLinks = siteMapLinks.filter(
    ({ isLoggedIn: required }) => !required || isLoggedIn
  )

  const renderSiteMapItem = ({ item }: { item: SiteMap }) => {
    const filteredSubPages = item.subPages.filter((subPage) => !subPage.isLoggedIn || isLoggedIn)
    return (
      <React.Fragment>
        <Li
          key={item.wording}
          accessibilityRole={AccessibilityRole.RADIOGROUP}
          accessibilityLabelledBy={item.wording}>
          <ItemContainer>
            <BulletContainer>
              <Bullet />
            </BulletContainer>
            <ListText>
              <InternalTouchableLink
                as={Button}
                wording={item.wording}
                navigateTo={item.navigateTo}
              />
            </ListText>
          </ItemContainer>
        </Li>

        {filteredSubPages.map(({ wording, navigateTo }) => (
          <Li
            key={wording}
            accessibilityRole={AccessibilityRole.RADIOGROUP}
            accessibilityLabelledBy={wording}>
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
          </Li>
        ))}
      </React.Fragment>
    )
  }

  const keyExtractor = (item: SiteMap) => item.wording

  return (
    <SecondaryPageWithBlurHeader title="Plan du site" enableMaxWidth={false} onGoBack={goBack}>
      <FlatList
        accessibilityRole={AccessibilityRole.LIST}
        listAs="ul"
        data={visibleSiteMapLinks}
        renderItem={renderSiteMapItem}
        keyExtractor={keyExtractor}
      />
    </SecondaryPageWithBlurHeader>
  )
}

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

const ItemContainer = styled.View<{ spacing?: number }>(({ spacing }) => ({
  flexDirection: 'row',
  marginLeft: getSpacing(3),
  marginTop: spacing ? getSpacing(spacing) : 0,
}))

const NestedItemContainer = styled.View<{ spacing?: number }>(({ spacing }) => ({
  flexDirection: 'row',
  marginLeft: getSpacing(7),
  marginTop: spacing ? getSpacing(spacing) : 0,
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

const ListText = styled(Typo.Body)({
  marginLeft: getSpacing(3),
  flex: 1,
})
