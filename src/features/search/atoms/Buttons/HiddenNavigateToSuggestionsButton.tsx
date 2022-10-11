import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { Platform } from 'react-native'

import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { SearchView } from 'features/search/types'
import { ButtonTertiaryPrimary } from 'ui/components/buttons/ButtonTertiaryPrimary'
import { styledButton } from 'ui/components/buttons/styledButton'
import { getSpacing } from 'ui/theme'
import { displayOnFocus } from 'ui/web/displayOnFocus/displayOnFocus'

export const HiddenNavigateToSuggestionsButton = () => {
  const { params } = useRoute<UseRouteType<'Search'>>()
  const { searchState } = useSearch()

  const { navigate } = useNavigation<UseNavigationType>()

  const navigateToSuggestions = useCallback(() => {
    navigate(
      ...getTabNavConfig('Search', {
        ...searchState,
        ...params,
        view: SearchView.Suggestions,
      })
    )
  }, [navigate, params, searchState])

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
