import { t } from '@lingui/macro'
import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
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

const SearchBoxWithLabel = ({ searchInputID, appEnableAutocomplete }: Props) => {
  const { top } = useCustomSafeInsets()

  return (
    <React.Fragment>
      <HeaderBackground height={top + getSpacing(20)} />
      <Spacer.TopScreen />
      <SearchBoxContainer testID="searchBoxWithLabel">
        <View {...getHeadingAttrs(1)}>
          <StyledInputLabel htmlFor={searchInputID}>{t`Recherche une offre`}</StyledInputLabel>
        </View>
        <Spacer.Column numberOfSpaces={2} />
        <FloatingSearchBoxContainer>
          {appEnableAutocomplete ? (
            <FloatingSearchBoxAutocomplete searchInputID={searchInputID} />
          ) : (
            <FloatingSearchBox searchInputID={searchInputID} />
          )}
        </FloatingSearchBoxContainer>
        <Spacer.Column numberOfSpaces={6} />
      </SearchBoxContainer>
    </React.Fragment>
  )
}

const SearchBoxWithoutLabel = ({ searchInputID, appEnableAutocomplete }: Props) => {
  const { top } = useCustomSafeInsets()

  return (
    <React.Fragment>
      {!!top && <HeaderBackground height={top} />}
      <Spacer.TopScreen />
      <SearchBoxContainer testID="searchBoxWithoutLabel">
        {appEnableAutocomplete ? (
          <SearchBoxAutocomplete
            searchInputID={searchInputID}
            accessibleHiddenTitle={t`Recherche une offre, un titre, un lieu...`}
          />
        ) : (
          <SearchBox
            searchInputID={searchInputID}
            accessibleHiddenTitle={t`Recherche une offre, un titre, un lieu...`}
          />
        )}
      </SearchBoxContainer>
      <Spacer.Column numberOfSpaces={1} />
    </React.Fragment>
  )
}

const SearchHeaderUnmemoized: FunctionComponent<Props> = ({
  searchInputID,
  appEnableAutocomplete,
}) => {
  const { params } = useRoute<UseRouteType<'Search'>>()

  return params === undefined || params.view === SearchView.Landing ? (
    <SearchBoxWithLabel
      searchInputID={searchInputID}
      appEnableAutocomplete={appEnableAutocomplete}
    />
  ) : (
    <SearchBoxWithoutLabel
      searchInputID={searchInputID}
      appEnableAutocomplete={appEnableAutocomplete}
    />
  )
}

export const SearchHeader = React.memo(SearchHeaderUnmemoized)

const SearchBoxContainer = styled.View({
  marginTop: getSpacing(6),
  paddingHorizontal: getSpacing(6),
  zIndex: 1,
})

const StyledInputLabel = styledInputLabel(InputLabel)(({ theme }) => ({
  ...theme.typography.title4,
  color: theme.colors.white,
}))

const FloatingSearchBoxContainer = styled.View({
  position: 'relative',
  zIndex: 1,
})

const FloatingSearchBox = styled(SearchBox)({
  position: 'absolute',
  left: 0,
  right: 0,
})

const FloatingSearchBoxAutocomplete = styled(SearchBoxAutocomplete)({
  position: 'absolute',
  left: 0,
  right: 0,
})
