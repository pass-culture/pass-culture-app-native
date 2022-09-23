import React, { memo, useState } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { FilterPageButtons } from 'features/search/components/FilterPageButtons/FilterPageButtons'
import { useForHeightKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'
import { ModalSpacing } from 'ui/components/modals/enum'

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
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  useForHeightKeyboardEvents(setKeyboardHeight)

  const modalSpacing = Platform.OS === 'ios' ? ModalSpacing.LG : ModalSpacing.SM

  return (
    <FilterPageButtonsContainer paddingBottom={keyboardHeight ? keyboardHeight - modalSpacing : 0}>
      <FilterPageButtons
        onResetPress={onResetPress}
        onSearchPress={onSearchPress}
        isModal={true}
        isSearchDisabled={isSearchDisabled}
      />
    </FilterPageButtonsContainer>
  )
})

const FilterPageButtonsContainer = styled.View<{ paddingBottom: number }>(({ paddingBottom }) => ({
  ...(paddingBottom ? { paddingBottom } : {}),
}))
