import { t } from '@lingui/macro'
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
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { getSpacing, Spacer } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'
import { displayOnFocus } from 'ui/web/displayOnFocus/displayOnFocus'

type Props = {
  searchInputID: string
}

export const SearchHeader = memo(function SearchHeader({ searchInputID }: Props) {
  const { params } = useRoute<UseRouteType<'Search'>>()
  const { top } = useCustomSafeInsets()
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
      {isLanding ? (
        <HeaderBackground height={top + getSpacing(20)} />
      ) : (
        !!top && <HeaderBackground height={top} />
      )}
      <SearchBoxContainer
        view={params?.view}
        testID={isLanding ? 'searchBoxWithLabel' : 'searchBoxWithoutLabel'}
        isLanding={isLanding}>
        {!!isLanding && (
          <React.Fragment>
            <View {...getHeadingAttrs(1)}>
              <StyledInputLabel htmlFor={searchInputID}>{t`Recherche une offre`}</StyledInputLabel>
            </View>
            <Spacer.Column numberOfSpaces={2} />
          </React.Fragment>
        )}
        <FloatingSearchBoxContainer isLanding={isLanding}>
          {!!isLanding && (
            <HiddenAccessibleButton
              onPress={navigateToSuggestions}
              wording="Recherche par mots-clés"
            />
          )}
          <FloatingSearchBox searchInputID={searchInputID} isLanding={isLanding} />
        </FloatingSearchBoxContainer>
        {!!isLanding && <Spacer.Column numberOfSpaces={6} />}
      </SearchBoxContainer>
      {!isLanding && <Spacer.Column numberOfSpaces={1} />}
    </React.Fragment>
  )
})

const SearchBoxContainer = styled.View<{ isLanding: boolean; view?: SearchView }>(
  ({ isLanding, view }) => ({
    marginTop: getSpacing(6),
    zIndex: 1,
    ...(isLanding
      ? {
          paddingHorizontal: getSpacing(6),
        }
      : {
          paddingLeft: getSpacing(4),
          paddingRight: getSpacing(view === SearchView.Results ? 4 : 6),
        }),
  })
)

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

const StyledInputLabel = styledInputLabel(InputLabel)(({ theme }) => ({
  ...theme.typography.title4,
  color: theme.colors.white,
}))

const FloatingSearchBoxContainer = styled.View<{ isLanding?: boolean }>(({ isLanding }) =>
  isLanding
    ? {
        position: 'relative',
        zIndex: 1,
      }
    : {}
)

const FloatingSearchBox = styled(SearchBox)<{ isLanding?: boolean }>(({ isLanding }) =>
  isLanding
    ? {
        position: 'absolute',
        left: 0,
        right: 0,
      }
    : {}
)
