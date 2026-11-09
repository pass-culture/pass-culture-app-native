import React, { PropsWithChildren, useEffect, useId } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { useSearchSuggestionsListbox } from 'features/search/components/SearchSuggestionsListbox/SearchSuggestionsListbox'
import {
  searchSuggestionsAccessibilityStore,
  useIsActiveOption,
} from 'features/search/store/searchSuggestionsAccessibility.store'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { touchableFocusOutline } from 'ui/theme/customFocusOutline/touchableFocusOutline'

type Props = PropsWithChildren<{
  onPress: () => void
  testID?: string
  style?: StyleProp<ViewStyle>
}>

export function SearchSuggestionOption({ onPress, testID, style, children }: Props) {
  const listbox = useSearchSuggestionsListbox()
  const suggestionsId = listbox?.suggestionsId ?? ''
  const optionId = useId()
  const isActive = useIsActiveOption(suggestionsId, optionId)

  useEffect(
    function registerInListbox() {
      if (!suggestionsId) return
      searchSuggestionsAccessibilityStore.actions.registerOption(suggestionsId, optionId)
      return () =>
        searchSuggestionsAccessibilityStore.actions.unregisterOption(suggestionsId, optionId)
    },
    [suggestionsId, optionId]
  )

  if (!listbox) {
    return (
      <TouchableOpacity
        testID={testID}
        onPress={onPress}
        style={style}
        accessibilityRole={AccessibilityRole.BUTTON}>
        {children}
      </TouchableOpacity>
    )
  }

  return (
    <OptionTouchable
      testID={testID}
      onPress={onPress}
      style={style}
      isActive={isActive}
      id={optionId}
      accessibilityRole={AccessibilityRole.OPTION}
      aria-selected={isActive}
      tabIndex={-1}>
      {children}
    </OptionTouchable>
  )
}

const OptionTouchable = styled(TouchableOpacity)<{ isActive: boolean }>(({ theme, isActive }) =>
  touchableFocusOutline({ theme, isFocus: isActive })
)
