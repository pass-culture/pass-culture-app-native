import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import { Platform, View } from 'react-native'

import { getSearchSuggestionsListboxId } from 'features/search/helpers/useSearchSuggestionsCombobox'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'

type SearchSuggestionsListboxContextValue = { suggestionsId: string }

const SearchSuggestionsListboxContext = createContext<SearchSuggestionsListboxContextValue | null>(
  null
)

export const useSearchSuggestionsListbox = () => useContext(SearchSuggestionsListboxContext)

type Props = PropsWithChildren<{ suggestionsId?: string; disabled?: boolean }>

export function SearchSuggestionsListbox({ suggestionsId, disabled = false, children }: Props) {
  const contextValue = useMemo(
    () => (suggestionsId && !disabled ? { suggestionsId } : null),
    [suggestionsId, disabled]
  )

  if (Platform.OS !== 'web') return children

  return (
    <SearchSuggestionsListboxContext.Provider value={contextValue}>
      <View
        {...(contextValue
          ? {
              id: getSearchSuggestionsListboxId(contextValue.suggestionsId),
              accessibilityRole: AccessibilityRole.LISTBOX,
              accessibilityLabel: 'Suggestions de recherche',
            }
          : {})}>
        {children}
      </View>
    </SearchSuggestionsListboxContext.Provider>
  )
}
