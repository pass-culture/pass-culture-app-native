import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { ListCategoryButtonProps } from 'features/search/helpers/useSortedSearchCategories/useSortedSearchCategories'
import { VenueMapBlock } from 'features/venueMap/components/VenueMapBlock/VenueMapBlock'
import { useMobileFontScaleToDisplay } from 'shared/accessibility/helpers/zoomHelpers'
import { CategoryButton } from 'shared/categoryButton/CategoryButton'
import { NewCategoryButton } from 'shared/categoryButton/NewCategoryButton'
import { Li } from 'ui/components/Li'
import { Ul } from 'ui/components/Ul'
import { getSpacing, Spacer, Typo } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { setTextSemantic } from 'ui/theme/typographyAttrs/setTextSemantic'

type Props = {
  sortedCategories: ListCategoryButtonProps
  shouldDisplayVenueMap: boolean
  isMapWithoutPositionAndNotLocated: boolean
  enableNewCategoryBlocks?: boolean
  children?: never
  onPressVenueMap: () => void
}

const CATEGORY_BUTTON_HEIGHT = getSpacing(36)
const NEW_CATEGORY_BUTTON_HEIGHT = getSpacing(26.5)
const DESKTOP_MAX_WIDTH = getSpacing(37.33)
const DESKTOP_MIN_WIDTH = getSpacing(45.6)
const MOBILE_MIN_WIDTH = '40%'
const MOBILE_MIN_WIDTH_WHEN_FONT_ZOOMED = '100%'
const MOBILE_MAX_WIDTH = '49%'
const MOBILE_MAX_WIDTH_WHEN_FONT_ZOOMED = '100%'

export const CategoriesListDumb: FunctionComponent<Props> = ({
  sortedCategories,
  shouldDisplayVenueMap,
  isMapWithoutPositionAndNotLocated,
  enableNewCategoryBlocks,
  onPressVenueMap,
}) => {
  const { designSystem } = useTheme()
  const mobileMinWidth = useMobileFontScaleToDisplay({
    default: MOBILE_MIN_WIDTH,
    at200PercentZoom: MOBILE_MIN_WIDTH_WHEN_FONT_ZOOMED,
  })
  const mobileMaxWidth = useMobileFontScaleToDisplay({
    default: MOBILE_MAX_WIDTH,
    at200PercentZoom: MOBILE_MAX_WIDTH_WHEN_FONT_ZOOMED,
  })

  return (
    <StyledScrollView showsHorizontalScrollIndicator={false} testID="categoriesButtons">
      {isMapWithoutPositionAndNotLocated || shouldDisplayVenueMap ? (
        <Container>
          <ContainerVenueMapBlock>
            <VenueMapBlock
              onPress={isMapWithoutPositionAndNotLocated ? onPressVenueMap : undefined}
              from="searchLanding"
            />
          </ContainerVenueMapBlock>
        </Container>
      ) : null}
      <CategoriesTitleV2 />
      <CategoriesButtonsContainer>
        {sortedCategories.map((item) => {
          return enableNewCategoryBlocks ? (
            <StyledLi
              key={item.label}
              mobileMinWidth={mobileMinWidth}
              mobileMaxWidth={mobileMaxWidth}>
              <StyledNewCategoryButton
                {...item}
                fillColor={designSystem.color.illustration[item.fillColor]}
                borderColor={designSystem.color.border[item.borderColor]}
                height={NEW_CATEGORY_BUTTON_HEIGHT}
              />
            </StyledLi>
          ) : (
            <StyledLi
              key={item.label}
              mobileMinWidth={mobileMinWidth}
              mobileMaxWidth={mobileMaxWidth}>
              <StyledCategoryButton
                {...item}
                fillColor={designSystem.color.background[item.fillColor]}
                borderColor={designSystem.color.border[item.borderColor]}
                height={CATEGORY_BUTTON_HEIGHT}
              />
            </StyledLi>
          )
        })}
      </CategoriesButtonsContainer>
      <Spacer.BottomScreen />
    </StyledScrollView>
  )
}

const StyledScrollView = styled.ScrollView(({ theme }) => ({
  paddingHorizontal: theme.contentPage.marginHorizontal,
  marginTop: theme.isMobileViewport ? 0 : theme.designSystem.size.spacing.s,
}))

const StyledCategoryButton = styled(CategoryButton)({
  width: '100%',
})

const StyledNewCategoryButton = styled(NewCategoryButton)({
  width: '100%',
})

const StyledLi = styled(Li)<{ mobileMinWidth: string; mobileMaxWidth: string }>(
  ({ theme, mobileMinWidth, mobileMaxWidth }) => ({
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 0,
    minWidth: theme.isMobileViewport ? mobileMinWidth : DESKTOP_MIN_WIDTH,
    maxWidth: theme.isMobileViewport ? mobileMaxWidth : DESKTOP_MAX_WIDTH,
  })
)

const CategoriesButtonsContainer = styled(Ul)(({ theme }) => ({
  width: '100%',
  ...(theme.isMobileViewport
    ? {
        marginTop: theme.designSystem.size.spacing.s,
        flexWrap: 'wrap',
        flexDirection: 'row',
        paddingVertical: theme.designSystem.size.spacing.s,
        gap: theme.designSystem.size.spacing.s,
      }
    : {
        paddingVertical: theme.designSystem.size.spacing.l,
        gap: theme.designSystem.size.spacing.l,
        display: 'grid',
        gridTemplateColumns: `repeat(5, 1fr)`,
      }),
}))

const CategoriesTitleV2 = styled(Typo.Title4).attrs({
  children: 'Parcours les catégories',
  ...setTextSemantic('h2'),
})(({ theme }) => ({
  width: '100%',
  marginTop: theme.designSystem.size.spacing.l,
}))

const Container = styled.View(({ theme }) => ({
  width: '100%',
  marginBottom: theme.designSystem.size.spacing.s,
}))

const ContainerVenueMapBlock = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
  marginBottom: theme.designSystem.size.spacing.s,
}))
