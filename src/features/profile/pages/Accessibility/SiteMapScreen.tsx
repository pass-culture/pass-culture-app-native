import React from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { getProfileStackConfig } from 'features/navigation/ProfileStackNavigator/getProfileStackConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { getSiteMapLinks } from 'features/profile/helpers/getSiteMapLinks'
import { useSortedSearchCategories } from 'features/search/helpers/useSortedSearchCategories/useSortedSearchCategories'
import { BulletListItem } from 'ui/components/BulletListItem'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'

export function SiteMapScreen() {
  const { goBack } = useGoBack(...getProfileStackConfig('Accessibility'))
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
                  <InternalTouchableLink
                    as={ButtonInsideTextBlack}
                    wording={wording}
                    navigateTo={navigateTo}
                  />
                }
                nestedListTexts={filteredSubPages.map(({ wording, navigateTo }) => (
                  <InternalTouchableLink
                    key={wording}
                    as={ButtonInsideTextBlack}
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

const ButtonInsideTextBlack = styled(ButtonInsideText).attrs(({ theme }) => ({
  buttonColor: theme.designSystem.color.text.default,
}))``
