import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { LocationWidget } from 'features/location/components/LocationWidget'
import { LocationWidgetBadge } from 'features/location/components/LocationWidgetBadge'
import { SearchLocationWidgetDesktopView } from 'features/location/components/SearchLocationWidgetDesktopView'
import { ScreenOrigin } from 'features/location/enums'
import { SearchView } from 'features/search/types'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { styledInputLabel } from 'ui/components/InputLabel/styledInputLabel'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  shouldDisplaySubtitle?: boolean
  searchInputID: string
  title: string
}

export const SearchTitleAndWidget: FunctionComponent<Props> = ({
  shouldDisplaySubtitle = false,
  searchInputID,
  title,
}) => {
  const { isMobileViewport, isDesktopViewport } = useTheme()
  const route = useRoute()
  const currentView = route.name

  const {
    data: { displayNewSearchHeader },
  } = useRemoteConfigQuery()

  const shouldDisplayMobileLocationBigWidget = isMobileViewport && shouldDisplaySubtitle
  const shouldDisplayMobileLocationSmallWidget =
    displayNewSearchHeader &&
    isMobileViewport &&
    (currentView === SearchView.Results || currentView === SearchView.Thematic)

  return (
    <TitleAndWidgetContainer>
      <TitleContainer testID="SearchHeaderTitleContainer">
        <TitleMainWrapper>
          <StyledTitleMainView
            shouldDisplayMobileLocationSmallWidget={shouldDisplayMobileLocationSmallWidget}>
            <StyledTitleMainText
              htmlFor={searchInputID}
              {...getHeadingAttrs(1)}
              small={shouldDisplayMobileLocationSmallWidget}>
              {title}
            </StyledTitleMainText>
          </StyledTitleMainView>
          {isDesktopViewport ? <SearchLocationWidgetDesktopView /> : null}
        </TitleMainWrapper>
      </TitleContainer>
      {shouldDisplayMobileLocationBigWidget ? (
        <View testID="InsideLocationWidget">
          <LocationWidget screenOrigin={ScreenOrigin.SEARCH} />
        </View>
      ) : null}
      {shouldDisplayMobileLocationSmallWidget ? (
        <LocationWidgetBadgeContainer testID="LocationWidgetBadge">
          <LocationWidgetBadge />
        </LocationWidgetBadgeContainer>
      ) : null}
    </TitleAndWidgetContainer>
  )
}

const StyledTitleMainText = styledInputLabel(InputLabel)<{ small?: boolean }>(
  ({ theme, small = false }) => ({
    ...(small ? theme.designSystem.typography.title3 : theme.designSystem.typography.title1),
    color: theme.designSystem.color.text.default,
  })
)

const TitleAndWidgetContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
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

const StyledTitleMainView = styled.View<{ shouldDisplayMobileLocationSmallWidget?: boolean }>(
  ({ shouldDisplayMobileLocationSmallWidget }) => ({
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    maxWidth: shouldDisplayMobileLocationSmallWidget ? 'inherit' : '75%',
    backgroundColor: 'red',
  })
)

const LocationWidgetBadgeContainer = styled.View({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
})
