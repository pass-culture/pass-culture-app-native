import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { VenueMapLocationModal } from 'features/location/components/VenueMapLocationModal'
import { ListCategoryButtonProps } from 'features/search/helpers/useSortedSearchCategories/useSortedSearchCategories'
import { VenueMapBlock } from 'features/venueMap/components/VenueMapBlock/VenueMapBlock'
import { useGetFontScale } from 'shared/accessibility/useGetFontScale'
import { CategoryButton } from 'shared/categoryButton/CategoryButton'
import { getSpacing, Spacer, Typo } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  sortedCategories: ListCategoryButtonProps
  shouldDisplayVenueMap: boolean
  isMapWithoutPositionAndNotLocated: boolean
  showVenueMapLocationModal: () => void
  venueMapLocationModalVisible: boolean
  hideVenueMapLocationModal: () => void
  children?: never
}

const DESKTOP_CATEGORY_BUTTON_HEIGHT = getSpacing(42)
const MOBILE_CATEGORY_BUTTON_HEIGHT = getSpacing(36)
const MOBILE_CATEGORY_BUTTON_HEIGHT_WITH_ZOOM = getSpacing(25)
const FONT_SCALE_ZOOM = 1.5

export const CategoriesListDumb: FunctionComponent<Props> = ({
  sortedCategories,
  shouldDisplayVenueMap,
  isMapWithoutPositionAndNotLocated,
  showVenueMapLocationModal,
  venueMapLocationModalVisible,
  hideVenueMapLocationModal,
}) => {
  const { fontScale } = useGetFontScale()
  const { designSystem } = useTheme()
  return (
    <StyledScrollView showsHorizontalScrollIndicator={false} testID="categoriesButtons">
      {isMapWithoutPositionAndNotLocated || shouldDisplayVenueMap ? (
        <Container>
          <ContainerVenueMapBlock>
            <VenueMapBlock
              onPress={isMapWithoutPositionAndNotLocated ? showVenueMapLocationModal : undefined}
              from="searchLanding"
            />
          </ContainerVenueMapBlock>
          <VenueMapLocationModal
            visible={venueMapLocationModalVisible}
            dismissModal={hideVenueMapLocationModal}
            openedFrom="searchLanding"
          />
        </Container>
      ) : null}
      <CategoriesTitleV2 />
      <CategoriesButtonsContainer>
        {sortedCategories.map((item) => {
          return (
            <StyledCategoryButton
              key={item.label}
              {...item}
              fillColor={designSystem.color.background[item.fillColor]}
              borderColor={designSystem.color.border[item.borderColor]}
              fontScale={fontScale}
            />
          )
        })}
      </CategoriesButtonsContainer>
      <Spacer.BottomScreen />
    </StyledScrollView>
  )
}

const StyledScrollView = styled.ScrollView(({ theme }) => ({
  paddingHorizontal: theme.contentPage.marginHorizontal,
  marginTop: theme.isMobileViewport ? 0 : theme.designSystem.size.spacing.xxl,
}))

const StyledCategoryButton = styled(CategoryButton)<{ fontScale: number }>(({
  theme,
  fontScale,
}) => {
  return {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 0,
    ...(theme.isMobileViewport
      ? fontScale > FONT_SCALE_ZOOM
        ? { height: MOBILE_CATEGORY_BUTTON_HEIGHT_WITH_ZOOM, minWidth: '100%' }
        : { height: MOBILE_CATEGORY_BUTTON_HEIGHT, minWidth: '40%', maxWidth: '49%' }
      : { height: DESKTOP_CATEGORY_BUTTON_HEIGHT }),
  }
})

const CategoriesButtonsContainer = styled.View(({ theme }) => ({
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
  ...getHeadingAttrs(2),
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
