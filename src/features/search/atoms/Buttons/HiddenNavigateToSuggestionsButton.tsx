import { useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { Platform } from 'react-native'

import { UseRouteType } from 'features/navigation/RootNavigator'
import { usePushWithStagedSearch } from 'features/search/pages/usePushWithStagedSearch'
import { SearchView } from 'features/search/types'
import { ButtonTertiaryPrimary } from 'ui/components/buttons/ButtonTertiaryPrimary'
import { styledButton } from 'ui/components/buttons/styledButton'
import { getSpacing } from 'ui/theme'
import { displayOnFocus } from 'ui/web/displayOnFocus/displayOnFocus'

export const HiddenNavigateToSuggestionsButton = () => {
  const { params } = useRoute<UseRouteType<'Search'>>()
  const pushWithStagedSearch = usePushWithStagedSearch()

  const navigateToSuggestions = useCallback(() => {
    pushWithStagedSearch({
      ...params,
      view: SearchView.Suggestions,
    })
  }, [params, pushWithStagedSearch])

  return (
    <HiddenAccessibleButton onPress={navigateToSuggestions} wording="Recherche par mots-clés" />
  )
}

const HiddenAccessibleButton = styledButton(displayOnFocus(ButtonTertiaryPrimary))({
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
