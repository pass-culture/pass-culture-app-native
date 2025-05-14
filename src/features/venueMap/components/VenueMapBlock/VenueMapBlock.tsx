import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { Referrals } from 'features/navigation/RootNavigator/types'
import { VENUE_MAP_BACKGROUND_APP_V2 } from 'features/venueMap/components/VenueMapBlock/VenueMapBackgroundAppV2'
import { removeSelectedVenue, setVenues } from 'features/venueMap/store/venueMapStore'
import { analytics } from 'libs/analytics/provider'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { Touchable } from 'ui/components/touchable/Touchable'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Typo, getSpacing } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

type Props = {
  from: Referrals
  onPress?: VoidFunction
}

export const VenueMapBlock: FunctionComponent<Props> = ({ onPress, from }) => {
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
    <TouchableContainer {...touchableProps} {...focusProps}>
      <StyledImageBackground source={VENUE_MAP_BACKGROUND_APP_V2}>
        <CardText>Explore la carte</CardText>
      </StyledImageBackground>
    </TouchableContainer>
  )
}

const StyledInternalTouchableLink = styled(InternalTouchableLink)<{ isFocus?: boolean }>(
  ({ theme, isFocus }) => ({
    overflow: 'hidden',
    borderRadius: theme.borderRadius.radius,
    borderColor: theme.colors.greyMedium,
    borderWidth: 1,
    marginTop: getSpacing(2),
    ...customFocusOutline({ isFocus, color: theme.colors.black }),
  })
)

const StyledTouchable = styled(Touchable)<{ isFocus?: boolean }>(({ theme, isFocus }) => ({
  overflow: 'hidden',
  borderRadius: theme.borderRadius.radius,
  borderColor: theme.colors.greyMedium,
  borderWidth: 1,
  marginTop: getSpacing(2),
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

const CardText = styled(Typo.BodyAccent)(({ theme }) => ({
  color: theme.designSystem.color.text.locked,
  position: 'absolute',
  left: getSpacing(4),
  bottom: getSpacing(4),
}))
