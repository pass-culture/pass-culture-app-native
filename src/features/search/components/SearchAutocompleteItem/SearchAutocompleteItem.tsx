import { useNavigation } from '@react-navigation/native'
import { SendEventForHits } from 'instantsearch.js/es/lib/utils'
import React from 'react'
import { Keyboard, Text } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { Highlight } from 'features/search/components/Highlight/Highlight'
import { useSearch } from 'features/search/context/SearchWrapper'
import { useAppliedFilters } from 'features/search/helpers/useAppliedFilters/useAppliedFilters'
import { SearchView } from 'features/search/types'
import { AlgoliaSuggestionHit } from 'libs/algolia'
import { analytics } from 'libs/firebase/analytics'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'
import { getSpacing } from 'ui/theme'

type Props = {
  hit: AlgoliaSuggestionHit
  sendEvent: SendEventForHits
}

export const SearchAutocompleteItem: React.FC<Props> = ({ hit, sendEvent }) => {
  const { query } = hit
  const { searchState } = useSearch()
  const { navigate } = useNavigation<UseNavigationType>()
  const appliedFilters = useAppliedFilters(searchState)

  const onPress = () => {
    sendEvent('click', hit, 'Suggestion clicked')
    Keyboard.dismiss()
    // When we hit enter, we may have selected a category or a venue on the search landing page
    // these are the two potentially 'staged' filters that we want to commit to the global search state.
    // We also want to commit the price filter, as beneficiary users may have access to different offer
    // price range depending on their available credit.
    const searchId = uuidv4()
    navigate(
      ...getTabNavConfig('Search', {
        ...searchState,
        query,
        view: SearchView.Results,
        searchId,
      })
    )

    analytics.logSearchQuery(query || '', appliedFilters, searchId)
  }

  return (
    <AutocompleteItemTouchable testID="autocompleteItem" onPress={onPress}>
      <MagnifyingGlassIconContainer>
        <MagnifyingGlassIcon />
      </MagnifyingGlassIconContainer>
      <StyledText numberOfLines={1} ellipsizeMode="tail">
        <Highlight hit={hit} attribute="query" />
      </StyledText>
    </AutocompleteItemTouchable>
  )
}

const MagnifyingGlassIconContainer = styled.View({ flexShrink: 0 })

const AutocompleteItemTouchable = styled.TouchableOpacity({
  flexDirection: 'row',
  alignItems: 'center',
  paddingBottom: getSpacing(4),
})

const MagnifyingGlassIcon = styled(MagnifyingGlass).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.colors.greyDark,
}))``

const StyledText = styled(Text)({
  marginLeft: getSpacing(2),
})
