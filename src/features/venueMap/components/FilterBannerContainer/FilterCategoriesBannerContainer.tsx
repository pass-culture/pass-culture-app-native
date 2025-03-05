import colorAlpha from 'color-alpha'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { FilterButton } from 'features/search/components/Buttons/FilterButton/FilterButton'
import { SingleFilterButton } from 'features/search/components/Buttons/SingleFilterButton/SingleFilterButton'
import { FILTER_BANNER_HEIGHT, filterGroups } from 'features/venueMap/constant'
import { useVenueMapFilters } from 'features/venueMap/hook/useVenueMapFilters'
import { FilterGroupKey } from 'features/venueMap/types'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { getSpacing } from 'ui/theme'

const BULLET_SIZE = 12

export const FilterCategoriesBannerContainer = () => {
  const headerHeight = useGetHeaderHeight()
  const { getSelectedMacroFilters, toggleMacroFilter } = useVenueMapFilters()

  const selectedGroups = getSelectedMacroFilters()

  const handleCategoryPress = (categoryId: FilterGroupKey) => {
    toggleMacroFilter(categoryId)
  }

  return (
    <Container headerHeight={headerHeight}>
      <ButtonsContainer>
        <FilterButton
          navigateTo={{ screen: 'VenueMapFiltersStackNavigator' }}
          activeFilters={selectedGroups.length}
        />
        {filterGroups.map(({ color, id, label }) => (
          <SingleFilterButton
            key={id}
            testID={id}
            icon={<ColoredGradientBullet color={color} />}
            label={label}
            isSelected={selectedGroups.includes(id)}
            onPress={() => handleCategoryPress(id)}
          />
        ))}
      </ButtonsContainer>
    </Container>
  )
}

const Container = styled.View<{ headerHeight: number }>(({ headerHeight }) => ({
  height: FILTER_BANNER_HEIGHT,
  marginTop: headerHeight,
  paddingHorizontal: getSpacing(6),
  paddingVertical: getSpacing(1),
}))

const ButtonsContainer = styled.View({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  columnGap: getSpacing(1),
})

const ColoredGradientBullet = styled(LinearGradient).attrs(({ color }: { color: string }) => ({
  colors: [color, colorAlpha(color, 0.7)],
}))<{ color: string }>({
  backgroundColor: 'black',
  width: BULLET_SIZE,
  height: BULLET_SIZE,
  borderRadius: BULLET_SIZE * 0.5,
})
