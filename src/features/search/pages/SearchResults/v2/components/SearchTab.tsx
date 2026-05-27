import React, { FC } from 'react'
import styled from 'styled-components/native'

import {
  SEARCH_FILTERS,
  SearchFilter,
  SelectSearchOffersParams,
} from 'features/search/queries/useSearchOffersQuery/types'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Checkmark } from 'ui/svg/icons/Checkmark'
import { Typo } from 'ui/theme'

type Props = {
  selectedFilter: SelectSearchOffersParams['selectedFilter']
  searchTabsMap: Record<SearchFilter, number>
  onFilterPress: (filter: SearchFilter) => void
}

export const SearchTab: FC<Props> = ({ selectedFilter, searchTabsMap, onFilterPress }) => {
  const activeFiltersCount = SEARCH_FILTERS.filter((filter) => searchTabsMap[filter] > 0).length
  if (activeFiltersCount <= 1) return null

  return (
    <StyledSearchFilterTabContainer gap={1}>
      {SEARCH_FILTERS.map((searchFilter) => {
        const hasHits = searchTabsMap[searchFilter]
        if (!hasHits) return null
        const isCurrentSelected = selectedFilter === searchFilter

        return (
          <StyledSearchFilterTab
            testID={`${searchFilter}-search-filter`}
            key={searchFilter}
            isSelected={isCurrentSelected}
            onPress={() => onFilterPress(searchFilter)}>
            {isCurrentSelected ? <Checkmark /> : null}
            <Typo.BodyAccentXs>{searchFilter}</Typo.BodyAccentXs>
          </StyledSearchFilterTab>
        )
      })}
    </StyledSearchFilterTabContainer>
  )
}

const StyledSearchFilterTabContainer = styled(ViewGap)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  marginTop: theme.designSystem.size.spacing.l,
}))
const StyledSearchFilterTab = styled(TouchableOpacity)<{ isSelected: boolean }>(
  ({ theme, isSelected }) => ({
    borderWidth: 1,
    borderColor: theme.designSystem.color.border.subtle,
    borderRadius: theme.designSystem.size.borderRadius.xxl,
    paddingVertical: theme.designSystem.size.spacing.xs,
    paddingHorizontal: theme.designSystem.size.spacing.l,
    alignItems: 'center',
    flexDirection: 'row',

    ...(isSelected && {
      borderWidth: 2,
      borderColor: theme.designSystem.color.border.selected,
      backgroundColor: theme.designSystem.color.background.disabled,
      gap: theme.designSystem.size.spacing.xs,
    }),
  })
)
