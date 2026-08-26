import React, { memo, useState } from 'react'
import styled from 'styled-components/native'

import { FilterPageButtons } from 'features/search/components/FilterPageButtons/FilterPageButtons'
import { FilterBehaviour } from 'features/search/enums'
import { useForHeightKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'

type Props = {
  onResetPress: () => void
  onSearchPress: () => void
  filterBehaviour: FilterBehaviour
  isSearchDisabled?: boolean
  isResetDisabled?: boolean
  displayGradient?: boolean
}

export const SearchFixedModalBottom = memo(function SearchFixedModalBottom({
  onResetPress,
  onSearchPress,
  filterBehaviour,
  isSearchDisabled,
  isResetDisabled,
  displayGradient,
}: Props) {
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  useForHeightKeyboardEvents(setKeyboardHeight)
  return (
    <StyledFilterPageButtons
      paddingBottom={keyboardHeight}
      onResetPress={onResetPress}
      onSearchPress={onSearchPress}
      isModal
      isSearchDisabled={isSearchDisabled}
      filterBehaviour={filterBehaviour}
      isResetDisabled={isResetDisabled}
      displayGradient={displayGradient}
    />
  )
})

const StyledFilterPageButtons = styled(FilterPageButtons)<{ paddingBottom: number }>(
  ({ theme }) => ({
    backgroundColor: theme.designSystem.color.background.default,
  })
)
