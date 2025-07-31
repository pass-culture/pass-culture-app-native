import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { LocationWidget } from 'features/location/components/LocationWidget'
import { SearchLocationWidgetDesktopView } from 'features/location/components/SearchLocationWidgetDesktopView'
import { ScreenOrigin } from 'features/location/enums'
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
  const { isDesktopViewport } = useTheme()
  const shouldDisplayMobileLocationWidget = shouldDisplaySubtitle && !isDesktopViewport
  return (
    <TitleAndWidgetContainer>
      <TitleContainer testID="SearchHeaderTitleContainer">
        <TitleMainWrapper>
          <StyledTitleMainView {...getHeadingAttrs(1)}>
            <StyledTitleMainText htmlFor={searchInputID}>{title}</StyledTitleMainText>
          </StyledTitleMainView>
          {isDesktopViewport ? <SearchLocationWidgetDesktopView /> : null}
        </TitleMainWrapper>
        {
          // eslint-disable-next-line local-rules/use-ternary-operator-in-jsx
          shouldDisplaySubtitle && <CaptionSubtitle>{subtitle}</CaptionSubtitle>
        }
      </TitleContainer>
      <View testID="InsideLocationWidget">
        {shouldDisplayMobileLocationWidget ? (
          <LocationWidget screenOrigin={ScreenOrigin.SEARCH} />
        ) : null}
      </View>
    </TitleAndWidgetContainer>
  )
}

const StyledTitleMainText = styledInputLabel(InputLabel)(({ theme }) => ({
  ...theme.designSystem.typography.title1,
  color: theme.designSystem.color.text.default,
}))

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
