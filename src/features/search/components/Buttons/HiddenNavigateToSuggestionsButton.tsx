import React, { useCallback } from 'react'
import { Platform } from 'react-native'

import { useSearch } from 'features/search/context/SearchWrapper'
import { SearchView } from 'features/search/types'
import { ButtonTertiaryPrimary } from 'ui/components/buttons/ButtonTertiaryPrimary'
import { styledButton } from 'ui/components/buttons/styledButton'
import { getSpacing } from 'ui/theme'
import { displayOnFocus } from 'ui/web/displayOnFocus/displayOnFocus'

export const HiddenNavigateToSuggestionsButton = () => {
  const { searchState, dispatch } = useSearch()

  const navigateToSuggestions = useCallback(() => {
    dispatch({
      type: 'SET_STATE',
      payload: {
        ...searchState,
        view: SearchView.Suggestions,
      },
    })
  }, [dispatch, searchState])

  return (
    <HiddenAccessibleButton onPress={navigateToSuggestions} wording="Recherche par mots-clés" />
  )
}

const HiddenAccessibleButton = styledButton(displayOnFocus(ButtonTertiaryPrimary))<{
  onPress: () => void
  wording: string
}>({
  margin: getSpacing(1),
  paddingLeft: getSpacing(4),
  paddingRight: getSpacing(4),
  backgroundColor: 'white',
  ...Platform.select({
    web: {
      '&:focus-visible': {
        outlineOffset: -2,
      },
    },
    default: {},
  }),
})
