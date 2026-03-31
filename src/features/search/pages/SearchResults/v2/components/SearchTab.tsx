import React, { FC } from 'react'
import styled from 'styled-components/native'

import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Checkmark } from 'ui/svg/icons/Checkmark'
import { Typo } from 'ui/theme'

const SEARCH_FILTERS = ['Offres', 'Lieux', 'Artistes'] as const
type SearchFilter = (typeof SEARCH_FILTERS)[number]

type Props = {
  selectedFilter: SearchFilter | null
  onFilterPress: (filter: SearchFilter) => void
}

export const SearchTab: FC<Props> = ({ selectedFilter, onFilterPress }) => {
  return (
    <StyledSearchFilterTabContainer gap={1}>
      {SEARCH_FILTERS.map((searchFilter) => {
        const isCurrentSelected = selectedFilter === searchFilter

        return (
          <StyledSearchFilterTab
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
    borderColor: '#90949D',
    borderRadius: theme.designSystem.size.borderRadius.xxl,
    paddingVertical: theme.designSystem.size.spacing.xs,
    paddingHorizontal: theme.designSystem.size.spacing.l,
    alignItems: 'center',
    flexDirection: 'row',

    ...(isSelected && {
      borderWidth: 2,
      borderColor: '#161617',
      backgroundColor: '#F1F1F4',
      gap: theme.designSystem.size.spacing.xs,
    }),
  })
)
