import React from 'react'
import { FlatList } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { getProfileHookConfig } from 'features/navigation/ProfileStackNavigator/getProfileHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { SiteMap, getSiteMapLinks } from 'features/profile/helpers/getSiteMapLinks'
import { useSortedSearchCategories } from 'features/search/helpers/useSortedSearchCategories/useSortedSearchCategories'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { BulletListItem } from 'ui/components/BulletListItem'
import { AppButton } from 'ui/components/buttons/AppButton/AppButton'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Li } from 'ui/components/Li'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { Typo } from 'ui/theme'

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
      <Li
        key={item.wording}
        accessibilityRole={AccessibilityRole.RADIOGROUP}
        accessibilityLabelledBy={item.wording}>
        <BulletListItem
          alignBullet
          text={
            <InternalTouchableLink
              as={Button}
              wording={item.wording}
              navigateTo={item.navigateTo}
            />
          }
          nestedListTexts={filteredSubPages.map(({ wording, navigateTo }) => (
            <InternalTouchableLink
              key={wording}
              as={Button}
              typography="BodyAccentXs"
              wording={wording}
              navigateTo={navigateTo}
            />
          ))}
        />
      </Li>
    )
  }

  const keyExtractor = (item: SiteMap) => item.wording

  return (
    <SecondaryPageWithBlurHeader title="Plan du site" enableMaxWidth={false} onGoBack={goBack}>
      <FlatList
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
