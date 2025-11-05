import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { LocationSearchWidgetBadge } from 'features/location/components/LocationSearchWidgetBadge'
import { LocationWidget } from 'features/location/components/LocationWidget'
import { SearchLocationWidgetDesktopView } from 'features/location/components/SearchLocationWidgetDesktopView'
import { ScreenOrigin } from 'features/location/enums'
import { SearchView } from 'features/search/types'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { styledInputLabel } from 'ui/components/InputLabel/styledInputLabel'
import { Typo } from 'ui/theme'
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
  const subtitle = 'Toutes les offres à portée de main'
  const { isMobileViewport, isDesktopViewport } = useTheme()
  const route = useRoute()
  const currentView = route.name

  const shouldDisplayMobileLocationBigWidget = isMobileViewport && shouldDisplaySubtitle
  const shouldDisplayMobileLocationSmallWidget =
    isMobileViewport && (currentView === SearchView.Results || currentView === SearchView.Thematic)

  const {
    data: { showNewSearchHeader },
  } = useRemoteConfigQuery()

  return (
    <TitleAndWidgetContainer>
      <TitleContainer testID="SearchHeaderTitleContainer">
        <TitleMainWrapper>
          <StyledTitleMainView>
            <StyledTitleMainText
              htmlFor={searchInputID}
              {...getHeadingAttrs(1)}
              small={showNewSearchHeader && shouldDisplayMobileLocationSmallWidget}>
              {title}
            </StyledTitleMainText>
          </StyledTitleMainView>
          {isDesktopViewport ? <SearchLocationWidgetDesktopView /> : null}
        </TitleMainWrapper>
        {shouldDisplaySubtitle ? <CaptionSubtitle>{subtitle}</CaptionSubtitle> : null}
      </TitleContainer>
      {shouldDisplayMobileLocationBigWidget ? (
        <View testID="LocationWidget">
          <LocationWidget screenOrigin={ScreenOrigin.SEARCH} />
        </View>
      ) : null}
      {shouldDisplayMobileLocationSmallWidget ? (
        <LocationSearchWidgetContainer testID="LocationSearchWidget">
          {showNewSearchHeader ? <LocationSearchWidgetBadge /> : null}
        </LocationSearchWidgetContainer>
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

const CaptionSubtitle = styled(Typo.BodyAccentXs)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xs,
  color: theme.designSystem.color.text.subtle,
}))

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

const StyledTitleMainView = styled.View({
  alignItems: 'center',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  maxWidth: '75%',
})

const LocationSearchWidgetContainer = styled.View({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
})
