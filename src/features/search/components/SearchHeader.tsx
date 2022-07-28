import { t } from '@lingui/macro'
import { useRoute } from '@react-navigation/native'
import React, { memo } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { UseRouteType } from 'features/navigation/RootNavigator'
import { SearchBox } from 'features/search/components/SearchBox'
import { SearchBoxAutocomplete } from 'features/search/components/SearchBoxAutocomplete'
import { SearchView } from 'features/search/types'
import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { styledInputLabel } from 'ui/components/InputLabel/styledInputLabel'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { getSpacing, Spacer } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

type Props = {
  searchInputID: string
  appEnableAutocomplete: boolean
}

export const SearchHeader = memo(function SearchHeader({
  searchInputID,
  appEnableAutocomplete,
}: Props) {
  const { params } = useRoute<UseRouteType<'Search'>>()
  const { top } = useCustomSafeInsets()

  const isLanding = params === undefined || params.view === SearchView.Landing
  return (
    <React.Fragment>
      <Spacer.TopScreen />
      {isLanding ? (
        <HeaderBackground height={top + getSpacing(20)} />
      ) : (
        !!top && <HeaderBackground height={top} />
      )}
      <SearchBoxContainer testID={isLanding ? 'searchBoxWithLabel' : 'searchBoxWithoutLabel'}>
        {!!isLanding && (
          <React.Fragment>
            <View {...getHeadingAttrs(1)}>
              <StyledInputLabel htmlFor={searchInputID}>{t`Recherche une offre`}</StyledInputLabel>
            </View>
            <Spacer.Column numberOfSpaces={2} />
          </React.Fragment>
        )}
        <FloatingSearchBoxContainer isLanding={isLanding}>
          {appEnableAutocomplete ? (
            <FloatingSearchBoxAutocomplete searchInputID={searchInputID} isLanding={isLanding} />
          ) : (
            <FloatingSearchBox searchInputID={searchInputID} isLanding={isLanding} />
          )}
        </FloatingSearchBoxContainer>
        {appEnableAutocomplete && isLanding ? <Spacer.Column numberOfSpaces={6} /> : null}
      </SearchBoxContainer>
      {!isLanding && <Spacer.Column numberOfSpaces={1} />}
    </React.Fragment>
  )
})

const SearchBoxContainer = styled.View({
  marginTop: getSpacing(6),
  paddingHorizontal: getSpacing(6),
  zIndex: 1,
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

const FloatingSearchBoxAutocomplete = styled(SearchBoxAutocomplete)<{ isLanding?: boolean }>(
  ({ isLanding }) =>
    isLanding
      ? {
          position: 'absolute',
          left: 0,
          right: 0,
        }
      : {}
)
