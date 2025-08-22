import React from 'react'
import { styled } from 'styled-components'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { getProfileHookConfig } from 'features/navigation/ProfileStackNavigator/getProfileHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { getSiteMapLinks } from 'features/profile/helpers/getSiteMapLinks'
import { useSortedSearchCategories } from 'features/search/helpers/useSortedSearchCategories/useSortedSearchCategories'
import { BulletListItem } from 'ui/components/BulletListItem'
import { AppButton } from 'ui/components/buttons/AppButton/AppButton'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { Typo } from 'ui/theme'

export function SiteMapScreen() {
  const { goBack } = useGoBack(...getProfileHookConfig('Accessibility'))
  const { isLoggedIn } = useAuthContext()
  const sortedCategories = useSortedSearchCategories()
  const siteMapLinks = getSiteMapLinks(sortedCategories)

  return (
    <SecondaryPageWithBlurHeader title="Plan du site" enableMaxWidth={false} onGoBack={goBack}>
      <VerticalUl>
        {siteMapLinks
          .filter(({ isLoggedIn: required }) => !required || isLoggedIn)
          .map(({ wording, navigateTo, subPages }) => {
            const filteredSubPages = subPages.filter((subPage) => !subPage.isLoggedIn || isLoggedIn)
            return (
              <BulletListItem
                key={wording}
                text={
                  <InternalTouchableLink as={Button} wording={wording} navigateTo={navigateTo} />
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
            )
          })}
      </VerticalUl>
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
