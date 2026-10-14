import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { FilterChip } from 'features/generalPublicHome/components/FilterChip'
import { RoundToggleButton } from 'features/generalPublicHome/components/RoundToggleButton'
import { DatePresetItem } from 'features/generalPublicHome/types'
import { Calendar } from 'ui/svg/icons/Calendar'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'

type Props = {
  isSearchOpen: boolean
  isCalendarOpen: boolean
  onToggleSearch: () => void
  onToggleCalendar: () => void
  datePresetItems: DatePresetItem[]
}

export const DateFilterBar: FunctionComponent<Props> = ({
  isSearchOpen,
  isCalendarOpen,
  onToggleSearch,
  onToggleCalendar,
  datePresetItems,
}) => (
  <Row>
    <RoundToggleButton
      Icon={MagnifyingGlass}
      label="Rechercher"
      checked={isSearchOpen}
      onPress={onToggleSearch}
    />
    <RoundToggleButton
      Icon={Calendar}
      label="Choisir une date"
      checked={isCalendarOpen}
      onPress={onToggleCalendar}
    />
    {datePresetItems.map(({ label, isSelected, onPress }) => (
      <FilterChip key={label} label={label} isSelected={isSelected} onPress={onPress} />
    ))}
  </Row>
)

// The page margin sits inside the scroll content so that the first items are not cut
const Row = styled.ScrollView.attrs(({ theme }) => ({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: {
    gap: theme.designSystem.size.spacing.s,
    paddingHorizontal: theme.contentPage.marginHorizontal,
  },
}))``
