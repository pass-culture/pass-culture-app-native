import colorAlpha from 'color-alpha'
import React from 'react'
import { View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { FilterButton } from 'features/search/components/Buttons/FilterButton/FilterButton'
import { SingleFilterButton } from 'features/search/components/Buttons/SingleFilterButton/SingleFilterButton'
import { FILTERS_VENUE_TYPE_MAPPING } from 'features/venueMap/constant'
import { useVenueMapFilters } from 'features/venueMap/hook/useVenueMapFilters'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { theme } from 'theme'
import { getSpacing } from 'ui/theme'

const BULLET_SIZE = 12

type FilterGroupKey = keyof typeof FILTERS_VENUE_TYPE_MAPPING

type FilterGroupData = {
  id: FilterGroupKey
  label: string
  color: string
}
const filterGroups: FilterGroupData[] = [
  { id: 'OUTINGS', label: 'Sorties', color: theme.colors.coral },
  { id: 'SHOPS', label: 'Boutiques', color: theme.colors.primary },
  { id: 'OTHERS', label: 'Autres', color: theme.colors.skyBlue },
]

export const FilterCategoriesBannerContainer = () => {
  const { getSelectedMacroFilters, toggleMacroFilter } = useVenueMapFilters()

  const selectedGroups = getSelectedMacroFilters()

  const handleCategoryPress = (categoryId: FilterGroupKey) => {
    toggleMacroFilter(categoryId)
  }

  return (
    <Container accessibilityRole={AccessibilityRole.LIST}>
      <FilterButton navigateTo={{ screen: 'VenueMapFiltersStackNavigator' }} />
      {filterGroups.map(({ color, id, label }) => (
        <SingleFilterButton
          key={id}
          testID={id}
          icon={<ColoredGradientBullet color={color} />}
          label={label}
          isSelected={selectedGroups.includes(id)}
          onPress={() => handleCategoryPress(id)}
          accessibilityRole={AccessibilityRole.LISTITEM}
        />
      ))}
    </Container>
  )
}

const Container = styled(View)({
  flexDirection: 'row',
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
