import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { VenueMapLocationModal } from 'features/location/components/VenueMapLocationModal'
import { CategoryButton } from 'features/search/components/Buttons/CategoryButton'
import { Gradient } from 'features/search/enums'
import { VenueMapBlock } from 'features/venueMap/components/VenueMapBlock/VenueMapBlock'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, TypoDS } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export type CategoryButtonProps = {
  label: string
  Illustration?: FunctionComponent<AccessibleIcon>
  baseColor?: ColorsEnum
  gradients: Gradient
  onPress: () => void
  children?: never
  // v2 App Design
  textColor: ColorsEnum
  fillColor: ColorsEnum
  borderColor: ColorsEnum
}
export type ListCategoryButtonProps = CategoryButtonProps[]

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
const MOBILE_GAPS_AND_PADDINGS = getSpacing(2)
const DESKTOP_GAPS_AND_PADDINGS = getSpacing(4)

export const CategoriesListDumb: FunctionComponent<Props> = ({
  sortedCategories,
  shouldDisplayVenueMap,
  isMapWithoutPositionAndNotLocated,
  showVenueMapLocationModal,
  venueMapLocationModalVisible,
  hideVenueMapLocationModal,
}) => {
  return (
    <StyledScrollView vertical showsHorizontalScrollIndicator={false} testID="categoriesButtons">
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
        {sortedCategories.map((item) => (
          <StyledCategoryButton key={item.label} {...item} />
        ))}
      </CategoriesButtonsContainer>
    </StyledScrollView>
  )
}

const StyledScrollView = styled.ScrollView(({ theme }) => ({
  paddingHorizontal: theme.contentPage.marginHorizontal,
  marginTop: theme.isMobileViewport ? getSpacing(0) : getSpacing(8),
}))

const StyledCategoryButton = styled(CategoryButton)(({ theme }) => ({
  flexGrow: 1,
  flexShrink: 0,
  flexBasis: 0,
  ...(theme.isMobileViewport
    ? { height: MOBILE_CATEGORY_BUTTON_HEIGHT, minWidth: '40%', maxWidth: '49%' }
    : { height: DESKTOP_CATEGORY_BUTTON_HEIGHT }),
}))

const CategoriesButtonsContainer = styled.View(({ theme }) => ({
  width: '100%',
  ...(theme.isMobileViewport
    ? {
        marginTop: MOBILE_GAPS_AND_PADDINGS,
        flexWrap: 'wrap',
        flexDirection: 'row',
        paddingVertical: MOBILE_GAPS_AND_PADDINGS,
        gap: MOBILE_GAPS_AND_PADDINGS,
      }
    : {
        paddingVertical: DESKTOP_GAPS_AND_PADDINGS,
        gap: DESKTOP_GAPS_AND_PADDINGS,
        display: 'grid',
        gridTemplateColumns: `repeat(5, 1fr)`,
      }),
}))

const CategoriesTitleV2 = styled(TypoDS.Title4).attrs({
  children: 'Parcours les catégories',
  ...getHeadingAttrs(2),
})({
  width: '100%',
  marginTop: getSpacing(4),
})

const Container = styled.View({
  width: '100%',
  marginBottom: getSpacing(2),
})

const ContainerVenueMapBlock = styled.View({
  marginTop: getSpacing(4),
  marginBottom: getSpacing(2),
})