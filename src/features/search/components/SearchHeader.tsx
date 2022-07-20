import { t } from '@lingui/macro'
import { useRoute } from '@react-navigation/native'
import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { UseRouteType } from 'features/navigation/RootNavigator'
import { SearchBox } from 'features/search/components/SearchBox'
import { SearchView } from 'features/search/types'
import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { styledInputLabel } from 'ui/components/InputLabel/styledInputLabel'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { getSpacing, Spacer } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

type Props = {
  searchInputID: string
}

const SearchBoxWithLabel = ({ searchInputID }: Omit<Props, 'paramsShowResults'>) => {
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
          <FloatingSearchBox searchInputID={searchInputID} showLocationButton={true} />
        </FloatingSearchBoxContainer>
        <Spacer.Column numberOfSpaces={6} />
      </SearchBoxContainer>
    </React.Fragment>
  )
}

const SearchBoxWithoutLabel = ({ searchInputID }: Omit<Props, 'paramsShowResults'>) => {
  const { top } = useCustomSafeInsets()

  return (
    <React.Fragment>
      {!!top && <HeaderBackground height={top} />}
      <Spacer.TopScreen />
      <SearchBoxContainer testID="searchBoxWithoutLabel">
        <SearchBox
          searchInputID={searchInputID}
          accessibleHiddenTitle={t`Recherche une offre, un titre, un lieu...`}
        />
      </SearchBoxContainer>
      <Spacer.Column numberOfSpaces={1} />
    </React.Fragment>
  )
}

export const SearchHeader: React.FC<Props> = ({ searchInputID }) => {
  const { params } = useRoute<UseRouteType<'Search'>>()

  return params === undefined || params.view === SearchView.Landing ? (
    <SearchBoxWithLabel searchInputID={searchInputID} />
  ) : (
    <SearchBoxWithoutLabel searchInputID={searchInputID} />
  )
}

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
