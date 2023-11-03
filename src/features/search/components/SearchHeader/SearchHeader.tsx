import { useNavigation } from '@react-navigation/native'
import React, { memo, useCallback } from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { LocationWidget } from 'features/location/components/LocationWidget'
import { SearchLocationWidgetDesktop } from 'features/location/components/LocationWidgetDesktop'
import { ScreenOrigin } from 'features/location/enums'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { SearchBox } from 'features/search/components/SearchBox/SearchBox'
import { CreateHistoryItem, SearchState, SearchView } from 'features/search/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { styledInputLabel } from 'ui/components/InputLabel/styledInputLabel'
import { Separator } from 'ui/components/Separator'
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
  const { navigate } = useNavigation<UseNavigationType>()
  const subtitle = 'Toutes les offres à portée de main'
  const shouldDisplaySubtitle = !searchView || searchView === SearchView.Landing
  const enableAppLocation = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_APP_LOCATION)
  const { isDesktopViewport } = useTheme()
  const shouldDisplayLocationWidget =
    enableAppLocation && shouldDisplaySubtitle && !isDesktopViewport

  const onSearch = useCallback(
    (payload: Partial<SearchState>) => {
      navigate(...getTabNavConfig('Search', payload))
    },
    [navigate]
  )

  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <HeaderContainer>
        <TitleAndWidgetContainer>
          <TitleContainer testID="SearchHeaderTitleContainer">
            <Title1Wrapper>
              <StyledTitle1View {...getHeadingAttrs(1)}>
                <StyledTitle1 htmlFor={searchInputID}>Rechercher</StyledTitle1>
              </StyledTitle1View>

              {!!isDesktopViewport && (
                <LocationWidgetDesktopView>
                  <Spacer.Row numberOfSpaces={6} />
                  <Separator.Vertical height={getSpacing(6)} />
                  <Spacer.Row numberOfSpaces={4} />
                  <SearchLocationWidgetDesktop onSearch={onSearch} />
                </LocationWidgetDesktopView>
              )}
            </Title1Wrapper>

            {!!shouldDisplaySubtitle && <CaptionSubtitle>{subtitle}</CaptionSubtitle>}
          </TitleContainer>
          {!!shouldDisplayLocationWidget && <LocationWidget screenOrigin={ScreenOrigin.SEARCH} />}
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
  width: '100%',
})

const Title1Wrapper = styled.View({
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
})

const StyledTitle1View = styled.View({
  alignItems: 'center',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  maxWidth: '75%',
})

const LocationWidgetDesktopView = styled.View({
  marginTop: getSpacing(1) / 2,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  maxWidth: '25%',
})
