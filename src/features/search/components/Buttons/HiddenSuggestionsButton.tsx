import React from 'react'
import { Platform } from 'react-native'

import { useSearch } from 'features/search/context/SearchWrapper'
import { ButtonTertiaryPrimary } from 'ui/components/buttons/ButtonTertiaryPrimary'
import { styledButton } from 'ui/components/buttons/styledButton'
import { displayOnFocus } from 'ui/web/displayOnFocus/displayOnFocus'

export const HiddenSuggestionsButton = () => {
  const { showSuggestions, isFocusOnSuggestions } = useSearch()
  if (isFocusOnSuggestions) return null
  return <HiddenAccessibleButton onPress={showSuggestions} wording="Recherche par mots-clés" />
}

const HiddenAccessibleButton = styledButton(displayOnFocus(ButtonTertiaryPrimary))<{
  onPress: () => void
  wording: string
}>(({ theme }) => ({
  margin: theme.designSystem.size.spacing.xs,
  paddingLeft: theme.designSystem.size.spacing.l,
  paddingRight: theme.designSystem.size.spacing.l,
  backgroundColor: theme.designSystem.color.background.default,
  ...Platform.select({
    web: { '&:focus-visible': { outlineOffset: -2 } },
    default: {},
  }),
}))
