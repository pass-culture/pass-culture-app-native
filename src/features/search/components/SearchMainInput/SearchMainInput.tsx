import React, { forwardRef } from 'react'
import {
  NativeSyntheticEvent,
  Platform,
  TextInput as RNTextInput,
  TextInputSubmitEditingEventData,
} from 'react-native'
import styled from 'styled-components/native'

import { SearchInput } from 'ui/components/inputs/SearchInput'
import { Search } from 'ui/svg/icons/Search'

type QueryProps = {
  query?: string
  setQuery: (text: string) => void
  onSubmitQuery: (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void
  resetQuery: () => void
}

type FocusProps = {
  isFocusable?: boolean
  isFocus?: boolean
  onFocus?: () => void
  disableInputClearButton: boolean
}

type Props = QueryProps &
  FocusProps & {
    searchInputID?: string
    accessibilityDescribedBy?: string
    children?: never
    placeholder?: string
  }

export const SearchMainInput = forwardRef<RNTextInput, Props>(function SearchMainInput(
  {
    query,
    setQuery,
    onSubmitQuery,
    resetQuery,
    isFocus = false,
    onFocus,
    disableInputClearButton,
    placeholder = 'Offre, artiste, lieu culturel...',
    ...props
  }: Props,
  ref
) {
  return (
    <StyledSearchInput
      ref={ref}
      placeholder={placeholder}
      value={query}
      onChangeText={setQuery}
      onSubmitEditing={onSubmitQuery}
      onPressRightIcon={resetQuery}
      nativeAutoFocus={Platform.OS !== 'web'}
      autoFocus={isFocus}
      onFocus={onFocus}
      LeftIcon={SearchIcon}
      inputHeight="regular"
      testID="searchInput"
      disableClearButton={disableInputClearButton}
      {...props}></StyledSearchInput>
  )
})

const StyledSearchInput = styled(SearchInput).attrs({
  inputContainerStyle: {
    flex: 1,
  },
})({})

const SearchIcon = styled(Search).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.subtle,
  size: theme.icons.sizes.smaller,
}))``
