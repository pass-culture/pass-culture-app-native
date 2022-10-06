import { useRoute } from '@react-navigation/native'
import React, { memo, useCallback } from 'react'
import { Platform, View } from 'react-native'
import styled from 'styled-components/native'

import { UseRouteType } from 'features/navigation/RootNavigator'
import { SearchBox } from 'features/search/components/SearchBox'
import { usePushWithStagedSearch } from 'features/search/pages/usePushWithStagedSearch'
import { SearchView } from 'features/search/types'
import { ButtonTertiaryPrimary } from 'ui/components/buttons/ButtonTertiaryPrimary'
import { styledButton } from 'ui/components/buttons/styledButton'
import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { styledInputLabel } from 'ui/components/InputLabel/styledInputLabel'
import { getSpacing, Spacer } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
import { displayOnFocus } from 'ui/web/displayOnFocus/displayOnFocus'

type Props = {
  searchInputID: string
}

export const SearchHeader = memo(function SearchHeader({ searchInputID }: Props) {
  const { params } = useRoute<UseRouteType<'Search'>>()
  const pushWithStagedSearch = usePushWithStagedSearch()

  const navigateToSuggestions = useCallback(() => {
    pushWithStagedSearch({
      ...params,
      view: SearchView.Suggestions,
    })
  }, [params, pushWithStagedSearch])

  const isLanding = params === undefined || params.view === SearchView.Landing

  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <SearchBoxContainer>
        <View {...getHeadingAttrs(1)}>
          <StyledTitle4 htmlFor={searchInputID}>Recherche une offre</StyledTitle4>
        </View>
        <Spacer.Column numberOfSpaces={2} />
        <View>
          {!!isLanding && (
            <HiddenAccessibleButton
              onPress={navigateToSuggestions}
              wording="Recherche par mots-clés"
            />
          )}
          <SearchBox searchInputID={searchInputID} isLanding={isLanding} />
        </View>
        <Spacer.Column numberOfSpaces={3} />
      </SearchBoxContainer>
    </React.Fragment>
  )
})

const SearchBoxContainer = styled.View({
  marginTop: getSpacing(6),
  zIndex: 1,
  paddingHorizontal: getSpacing(6),
})

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

const StyledTitle4 = styledInputLabel(InputLabel)(({ theme }) => ({
  ...theme.typography.title4,
}))
