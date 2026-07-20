import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useMemo } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { UseNavigationType, UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { ThematicSearchCategories } from 'features/navigation/navigators/SearchStackNavigator/types'
import { useSearch } from 'features/search/context/SearchWrapper'
import { useNativeCategories } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { useSubcategoriesQuery } from 'queries/subcategories/useSubcategoriesQuery'
import { useMobileFontScaleToDisplay } from 'shared/accessibility/helpers/zoomHelpers'
import { useGetHeaderHeight } from 'shared/header/useGetHeaderHeight'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { getSubcategoryButtonContent } from 'ui/components/buttons/SubcategoryButton/helpers'
import { SubcategoryButton } from 'ui/components/buttons/SubcategoryButton/SubcategoryButton'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { Page } from 'ui/pages/Page'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const TITLE = 'Tout parcourir'
const MOBILE_MIN_WIDTH = '40%'
const MOBILE_MIN_WIDTH_WHEN_FONT_ZOOMED = '100%'
const MOBILE_MAX_WIDTH = '49%'
const MOBILE_MAX_WIDTH_WHEN_FONT_ZOOMED = '100%'

export const ThematicSearchSubcategories = () => {
  const headerHeight = useGetHeaderHeight()
  const { params } = useRoute<UseRouteType<'ThematicSearchSubcategories'>>()
  const { goBack } = useNavigation<UseNavigationType>()
  const { headerTransition, onScroll } = useOpacityTransition()

  const offerCategories = (params?.offerCategories ?? []) as ThematicSearchCategories[]
  const offerCategory = offerCategories[0]
  const { data: subcategories = PLACEHOLDER_DATA } = useSubcategoriesQuery()
  const { searchState, dispatch } = useSearch()
  const { designSystem } = useTheme()
  const nativeCategories = useNativeCategories(offerCategory)

  const subcategoryButtonContent = useMemo(
    () =>
      getSubcategoryButtonContent({
        nativeCategories,
        offerCategory,
        subcategories,
        searchState,
        dispatch,
        backgroundColors: designSystem.color.background,
        borderColors: designSystem.color.border,
      }),
    [
      dispatch,
      nativeCategories,
      offerCategory,
      searchState,
      subcategories,
      designSystem.color.background,
      designSystem.color.border,
    ]
  )

  const mobileMinWidth = useMobileFontScaleToDisplay({
    default: MOBILE_MIN_WIDTH,
    at200PercentZoom: MOBILE_MIN_WIDTH_WHEN_FONT_ZOOMED,
  })
  const mobileMaxWidth = useMobileFontScaleToDisplay({
    default: MOBILE_MAX_WIDTH,
    at200PercentZoom: MOBILE_MAX_WIDTH_WHEN_FONT_ZOOMED,
  })

  return (
    <Page>
      <StyledScrollView onScroll={onScroll} scrollEventThrottle={16}>
        <Placeholder height={headerHeight} />
        <Title {...getHeadingAttrs(1)}>{TITLE}</Title>
        <SubcategoryButtonsContainer>
          {subcategoryButtonContent.map((item) => (
            <StyledSubcategoryButton
              key={item.label}
              {...item}
              mobileMinWidth={mobileMinWidth}
              mobileMaxWidth={mobileMaxWidth}
            />
          ))}
        </SubcategoryButtonsContainer>
        <Spacer.BottomScreen />
      </StyledScrollView>
      {/* On native header is called after Body to implement the BlurView for iOS */}
      <ContentHeader headerTitle={TITLE} onBackPress={goBack} headerTransition={headerTransition} />
    </Page>
  )
}

const StyledScrollView = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: {
    paddingHorizontal: theme.contentPage.marginHorizontal,
    paddingVertical: theme.contentPage.marginVertical,
  },
}))``

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))

const Title = styled(Typo.Title2)(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.l,
}))

const SubcategoryButtonsContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: theme.designSystem.size.spacing.l,
  paddingVertical: theme.designSystem.size.spacing.xl,
}))

const StyledSubcategoryButton = styled(SubcategoryButton)<{
  mobileMinWidth: string
  mobileMaxWidth: string
}>(({ mobileMinWidth, mobileMaxWidth }) => ({
  flexGrow: 1,
  flexShrink: 0,
  flexBasis: 0,
  width: 'auto',
  minWidth: mobileMinWidth,
  maxWidth: mobileMaxWidth,
}))
