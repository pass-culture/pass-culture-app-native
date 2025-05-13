import React, { memo, useState } from 'react'
import { Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { FilterPageButtons } from 'features/search/components/FilterPageButtons/FilterPageButtons'
import { FilterBehaviour } from 'features/search/enums'
import { useForHeightKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'

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
  const { modal } = useTheme()
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  useForHeightKeyboardEvents(setKeyboardHeight)

  const modalSpacing = Platform.OS === 'ios' ? modal.spacing.LG : modal.spacing.SM

  return (
    <FilterPageButtonsContainer paddingBottom={keyboardHeight ? keyboardHeight - modalSpacing : 0}>
      <FilterPageButtons
        onResetPress={onResetPress}
        onSearchPress={onSearchPress}
        isModal
        isSearchDisabled={isSearchDisabled}
        filterBehaviour={filterBehaviour}
        isResetDisabled={isResetDisabled}
      />
    </FilterPageButtonsContainer>
  )
})

const FilterPageButtonsContainer = styled.View<{ paddingBottom: number }>(({ paddingBottom }) => ({
  ...(paddingBottom ? { paddingBottom } : {}),
}))
