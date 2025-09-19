import React, { memo } from 'react'

import { FilterPageButtons } from 'features/search/components/FilterPageButtons/FilterPageButtons'
import { SearchFixedModalBottomContainer } from 'features/search/components/SearchFixedModalBottomContainer'
import { FilterBehaviour } from 'features/search/enums'

type Props = {
  onResetPress: () => void
  onSearchPress: () => void
  filterBehaviour: FilterBehaviour
  isSearchDisabled?: boolean
  isResetDisabled?: boolean
}

export const SearchFixedModalBottom = memo(function SearchFixedModalBottom({
  onResetPress,
  onSearchPress,
  filterBehaviour,
  isSearchDisabled,
  isResetDisabled,
}: Props) {
  return (
    <SearchFixedModalBottomContainer>
      <FilterPageButtons
        onResetPress={onResetPress}
        onSearchPress={onSearchPress}
        isModal
        isSearchDisabled={isSearchDisabled}
        filterBehaviour={filterBehaviour}
        isResetDisabled={isResetDisabled}
      />
    </SearchFixedModalBottomContainer>
  )
})
