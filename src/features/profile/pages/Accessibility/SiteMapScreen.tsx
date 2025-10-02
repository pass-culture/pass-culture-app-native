import React from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { getProfileHookConfig } from 'features/navigation/ProfileStackNavigator/getProfileHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { getSiteMapLinks } from 'features/profile/helpers/getSiteMapLinks'
import { useSortedSearchCategories } from 'features/search/helpers/useSortedSearchCategories/useSortedSearchCategories'
import { getLineHeightPx } from 'libs/parsers/getLineHeightPx'
import { AppButton } from 'ui/components/buttons/AppButton/AppButton'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Li } from 'ui/components/Li'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { VerticalUl } from 'ui/components/Ul'
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

  const listItems = visibleSiteMapLinks.flatMap((item) => {
    const parentJsx = (
      <ItemContainer key={item.wording}>
        <BulletContainer>
          <Bullet />
        </BulletContainer>
        <ListText>
          <InternalTouchableLink as={Button} wording={item.wording} navigateTo={item.navigateTo} />
        </ListText>
      </ItemContainer>
    )

    const childrenJsx = item.subPages
      .filter((subPage) => !subPage.isLoggedIn || isLoggedIn)
      .map((subPage) => (
        <NestedItemContainer key={subPage.wording}>
          <BulletContainer>
            <NestedBullet />
          </BulletContainer>
          <ListText>
            <InternalTouchableLink
              as={Button}
              typography="BodyAccentXs"
              wording={subPage.wording}
              navigateTo={subPage.navigateTo}
            />
          </ListText>
        </NestedItemContainer>
      ))

    return [parentJsx, ...childrenJsx]
  })

  return (
    <SecondaryPageWithBlurHeader title="Plan du site" enableMaxWidth={false} onGoBack={goBack}>
      <StyledVerticalUl>
        {listItems.map((item) => {
          return <Li key={item.key}>{item}</Li>
        })}
      </StyledVerticalUl>
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

const ItemContainer = styled.View<{ spacing?: number }>(() => ({
  flexDirection: 'row',
  marginLeft: getSpacing(3),
}))

const NestedItemContainer = styled.View<{ spacing?: number }>(() => ({
  flexDirection: 'row',
  marginLeft: getSpacing(7),
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

const ListText = styled.View({
  marginLeft: getSpacing(3),
  flex: 1,
})

const StyledVerticalUl = styled(VerticalUl)({
  width: '100%',
})
