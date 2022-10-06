import { SendEventForHits } from 'instantsearch.js/es/lib/utils'
import React from 'react'
import { Keyboard, Text } from 'react-native'
import styled from 'styled-components/native'

import { Highlight } from 'features/search/components/Highlight'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { usePushWithStagedSearch } from 'features/search/pages/usePushWithStagedSearch'
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
  const { searchState: stagedSearchState } = useStagedSearch()
  const { locationFilter } = stagedSearchState
  const pushWithStagedSearch = usePushWithStagedSearch()

  const onPress = () => {
    sendEvent('click', hit, 'Suggestion clicked')
    Keyboard.dismiss()
    // When we hit enter, we may have selected a category or a venue on the search landing page
    // these are the two potentially 'staged' filters that we want to commit to the global search state.
    // We also want to commit the price filter, as beneficiary users may have access to different offer
    // price range depending on their available credit.
    const { priceRange } = stagedSearchState
    pushWithStagedSearch({
      query,
      locationFilter,
      priceRange,
      view: SearchView.Results,
    })

    analytics.logSearchQuery(query || '')
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
