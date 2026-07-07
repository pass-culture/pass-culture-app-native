import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { ThematicSearchCategories } from 'features/navigation/navigators/SearchStackNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { SubcategoryButtonList } from 'ui/components/buttons/SubcategoryButton/SubcategoryButtonList'
import { useSubcategoryButtonContent } from 'ui/components/buttons/SubcategoryButton/useSubcategoryButtonContent'
import { SeeAllButton } from 'ui/components/SeeAllButton/SeeAllButton'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  offerCategory: ThematicSearchCategories
}

export const SubcategoryButtonListWrapper: React.FC<Props> = ({ offerCategory }) => {
  const { isMobileViewport } = useTheme()
  const subcategoryButtonContent = useSubcategoryButtonContent(offerCategory)

  const onBeforeNavigate = () => {
    void analytics.logClickSeeAll({
      type: 'categories',
      moduleName: 'Tout parcourir',
      from: 'thematicsearch',
    })
  }

  return (
    <React.Fragment>
      {isMobileViewport ? (
        <HeaderContainer>
          <TitleContainer>
            <Typo.Title3 {...getHeadingAttrs(2)}>Tout parcourir</Typo.Title3>
          </TitleContainer>
          <SeeAllButton
            playlistTitle="Tout parcourir"
            data={{
              onBeforeNavigate,
              navigateToVerticalPlaylist: {
                screen: 'ThematicSearchSubcategories',
                params: { offerCategories: [offerCategory] },
              },
              hideSearchSeeAll: true,
            }}
          />
        </HeaderContainer>
      ) : null}
      <SubcategoryButtonList subcategoryButtonContent={subcategoryButtonContent} />
    </React.Fragment>
  )
}

const HeaderContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: theme.designSystem.size.spacing.xl,
  paddingTop: theme.designSystem.size.spacing.xl,
}))

const TitleContainer = styled.View({
  flexShrink: 1,
})
