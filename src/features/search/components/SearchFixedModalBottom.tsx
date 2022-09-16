import React, { memo } from 'react'

import { FilterPageButtons } from 'features/search/components/FilterPageButtons/FilterPageButtons'

type Props = {
  onResetPress: () => void
  onSearchPress: () => void
}

export const SearchFixedModalBottom = memo(function SearchFixedModalBottom({
  onResetPress,
  onSearchPress,
}: Props) {
  return (
    <FilterPageButtons onResetPress={onResetPress} onSearchPress={onSearchPress} isModal={true} />
  )
})
