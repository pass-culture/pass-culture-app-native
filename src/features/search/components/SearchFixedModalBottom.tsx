import React, { memo } from 'react'

import { FilterPageButtons } from 'features/search/components/FilterPageButtons/FilterPageButtons'

type Props = {
  onResetPress: () => void
  onSearchPress: () => void
  isSearchDisabled?: boolean
}

export const SearchFixedModalBottom = memo(function SearchFixedModalBottom({
  onResetPress,
  onSearchPress,
  isSearchDisabled,
}: Props) {
  return (
    <FilterPageButtons
      onResetPress={onResetPress}
      onSearchPress={onSearchPress}
      isModal={true}
      isSearchDisabled={isSearchDisabled}
    />
  )
})
