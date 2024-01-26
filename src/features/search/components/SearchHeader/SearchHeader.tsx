import React, { memo } from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { LocationWidget } from 'features/location/components/LocationWidget'
import { SearchLocationWidgetDesktopView } from 'features/location/components/SearchLocationWidgetDesktopView'
import { ScreenOrigin } from 'features/location/enums'
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
  const shouldDisplayMobileLocationWidget =
    enableAppLocation && shouldDisplaySubtitle && !isDesktopViewport
  const shouldDisplayDesktopLocationWidget = enableAppLocation && isDesktopViewport

  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <HeaderContainer>
        <TitleAndWidgetContainer>
          <TitleContainer testID="SearchHeaderTitleContainer">
            <TitleMainWrapper>
              <StyledTitleMainView {...getHeadingAttrs(1)}>
                <StyledTitleMainText htmlFor={searchInputID}>Rechercher</StyledTitleMainText>
              </StyledTitleMainView>
              {!!shouldDisplayDesktopLocationWidget && <SearchLocationWidgetDesktopView />}
            </TitleMainWrapper>
            {
              // eslint-disable-next-line local-rules/no-string-check-before-component
              shouldDisplaySubtitle && <CaptionSubtitle>{subtitle}</CaptionSubtitle>
            }
          </TitleContainer>
          <View testID="InsideLocationWidget">
            {!!shouldDisplayMobileLocationWidget && (
              <LocationWidget screenOrigin={ScreenOrigin.SEARCH} />
            )}
          </View>
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

const StyledTitleMainText = styledInputLabel(InputLabel)(({ theme }) => ({
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
  width: '100%',
})

const TitleMainWrapper = styled.View({
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
})

const StyledTitleMainView = styled.View({
  alignItems: 'center',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  maxWidth: '75%',
})
