import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { VENUE_MAP_BACKGROUND } from 'features/venueMap/components/VenueMapBlock/VenueMapBackground'
import { removeSelectedVenue, setVenues } from 'features/venueMap/store/venueMapStore'
import { analytics } from 'libs/analytics/provider'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { Touchable } from 'ui/components/touchable/Touchable'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

import type { VenueMapBlockProps } from './types'

export const VenueMapBlockLegacy: FunctionComponent<VenueMapBlockProps> = ({ onPress, from }) => {
  const focusProps = useHandleFocus()

  const TouchableContainer = onPress ? StyledTouchable : StyledInternalTouchableLink

  const handleOnBeforeNavigate = () => {
    removeSelectedVenue()
    setVenues([])
    analytics.logConsultVenueMap({ from })
  }

  const touchableProps = onPress
    ? { onPress }
    : { navigateTo: { screen: 'VenueMap' }, onBeforeNavigate: handleOnBeforeNavigate }

  return (
    <React.Fragment>
      <TypoDS.Title3 {...getHeadingAttrs(2)}>Carte des lieux culturels</TypoDS.Title3>
      <Spacer.Column numberOfSpaces={4} />
      <TouchableContainer {...touchableProps} {...focusProps}>
        <StyledImageBackground source={VENUE_MAP_BACKGROUND}>
          <StyledLinearGradient />
          <CardText>Explorer les lieux</CardText>
        </StyledImageBackground>
      </TouchableContainer>
    </React.Fragment>
  )
}

const StyledInternalTouchableLink = styled(InternalTouchableLink)<{ isFocus?: boolean }>(
  ({ theme, isFocus }) => ({
    overflow: 'hidden',
    borderRadius: theme.borderRadius.radius,
    borderColor: theme.colors.greyMedium,
    borderWidth: 1,
    ...customFocusOutline({ isFocus, color: theme.colors.black }),
  })
)

const StyledTouchable = styled(Touchable)<{ isFocus?: boolean }>(({ theme, isFocus }) => ({
  overflow: 'hidden',
  borderRadius: theme.borderRadius.radius,
  borderColor: theme.colors.greyMedium,
  borderWidth: 1,
  ...customFocusOutline({ isFocus, color: theme.colors.black }),
}))

const StyledImageBackground = styled.ImageBackground.attrs(({ theme }) => ({
  imageStyle: {
    borderRadius: theme.borderRadius.radius,
  },
}))({
  width: '100%',
  height: getSpacing(25),
})

const StyledLinearGradient = styled(LinearGradient).attrs(({ theme }) => ({
  useAngle: true,
  angle: 69,
  locations: [0.11, 0.68, 1],
  colors: [
    colorAlpha(theme.colors.white, 1),
    colorAlpha(theme.colors.white, 0.7),
    colorAlpha(theme.colors.white, 0),
  ],
}))(({ theme }) => ({
  height: '100%',
  width: '100%',
  borderRadius: theme.borderRadius.radius,
}))

const CardText = styled(TypoDS.BodyAccent)({
  position: 'absolute',
  left: getSpacing(4),
  bottom: getSpacing(4),
})
