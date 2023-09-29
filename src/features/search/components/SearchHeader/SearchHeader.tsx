import React, { memo } from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { LocationWidget } from 'features/location/components/LocationWidget'
import { SearchBox } from 'features/search/components/SearchBox/SearchBox'
import { CreateHistoryItem, SearchView } from 'features/search/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { styledInputLabel } from 'ui/components/InputLabel/styledInputLabel'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  searchInputID: string
  addSearchHistory: (item: CreateHistoryItem) => void
  searchInHistory: (search: string) => void
  searchView?: SearchView
}

export const SearchHeader = memo(function SearchHeader({
  searchInputID,
  searchView,
  addSearchHistory,
  searchInHistory,
}: Props) {
  const subtitle = 'Toutes les offres à portée de main'
  const shouldDisplaySubtitle = !searchView || searchView === SearchView.Landing
  const enableAppLocation = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_APP_LOCATION)
  const { isDesktopViewport } = useTheme()
  const shouldDisplayLocationWidget =
    enableAppLocation && shouldDisplaySubtitle && !isDesktopViewport

  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <HeaderContainer>
        <TitleAndWidgetContainer>
          <TitleContainer>
            <View {...getHeadingAttrs(1)}>
              <StyledTitle1 htmlFor={searchInputID}>Rechercher</StyledTitle1>
            </View>
            {!!shouldDisplaySubtitle && <CaptionSubtitle>{subtitle}</CaptionSubtitle>}
          </TitleContainer>
          {!!shouldDisplayLocationWidget && <LocationWidget enableTooltip={false} />}
        </TitleAndWidgetContainer>
        <Spacer.Column numberOfSpaces={4} />
        <View>
          <SearchBox
            searchInputID={searchInputID}
            addSearchHistory={addSearchHistory}
            searchInHistory={searchInHistory}
          />
        </View>
      </HeaderContainer>
    </React.Fragment>
  )
})

const HeaderContainer = styled.View(({ theme }) => ({
  marginTop: getSpacing(6),
  zIndex: theme.zIndex.header,
  paddingHorizontal: getSpacing(6),
}))

const StyledTitle1 = styledInputLabel(InputLabel)(({ theme }) => ({
  ...theme.typography.title1,
}))

const CaptionSubtitle = styled(Typo.Caption)(({ theme }) => ({
  marginTop: getSpacing(1),
  color: theme.colors.greyDark,
}))

const TitleAndWidgetContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
})

const TitleContainer = styled.View({
  flexShrink: 1,
})
