import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { Referrals } from 'features/navigation/RootNavigator/types'
import { VENUE_MAP_BACKGROUND_APP_V2 } from 'features/venueMap/components/VenueMapBlock/VenueMapBackgroundAppV2'
import { removeSelectedVenue, setVenues } from 'features/venueMap/store/venueMapStore'
import { analytics } from 'libs/analytics/provider'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { accessibilityRoleInternalNavigation } from 'shared/accessibility/accessibilityRoleInternalNavigation'
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

  const handleOnBeforeNavigate = () => {
    removeSelectedVenue()
    setVenues([])
    analytics.logConsultVenueMap({ from })
  }

  const title = 'Explore la carte'
  const accessibilityProps = {
    accessibilityLabel: title,
    accessibilityRole: accessibilityRoleInternalNavigation(),
  }

  return onPress ? (
    <StyledTouchable onPress={onPress} {...accessibilityProps} {...focusProps}>
      <StyledImageBackground source={VENUE_MAP_BACKGROUND_APP_V2}>
        <CardText>{title}</CardText>
      </StyledImageBackground>
    </StyledTouchable>
  ) : (
    <StyledInternalTouchableLink
      navigateTo={{ screen: 'VenueMap' }}
      onBeforeNavigate={handleOnBeforeNavigate}
      {...accessibilityProps}
      {...focusProps}>
      <StyledImageBackground source={VENUE_MAP_BACKGROUND_APP_V2}>
        <CardText>{title}</CardText>
      </StyledImageBackground>
    </StyledInternalTouchableLink>
  )
}

const StyledInternalTouchableLink = styled(InternalTouchableLink)<{ isFocus?: boolean }>(
  ({ theme, isFocus }) => ({
    overflow: 'hidden',
    borderRadius: theme.designSystem.size.borderRadius.m,
    borderColor: theme.designSystem.color.border.default,
    borderWidth: 1,
    marginTop: theme.designSystem.size.spacing.s,
    ...customFocusOutline({ isFocus }),
  })
)

const StyledTouchable = styled(Touchable)<{ isFocus?: boolean }>(({ theme, isFocus }) => ({
  overflow: 'hidden',
  borderRadius: theme.designSystem.size.borderRadius.m,
  borderColor: theme.designSystem.color.border.default,
  borderWidth: 1,
  marginTop: theme.designSystem.size.spacing.s,
  ...customFocusOutline({ isFocus }),
}))

const StyledImageBackground = styled.ImageBackground.attrs(({ theme }) => ({
  imageStyle: {
    borderRadius: theme.designSystem.size.borderRadius.m,
  },
}))({
  width: '100%',
  height: getSpacing(25),
})

const CardText = styled(Typo.BodyAccent)(({ theme }) => ({
  color: theme.designSystem.color.text.locked,
  position: 'absolute',
  left: theme.designSystem.size.spacing.l,
  bottom: theme.designSystem.size.spacing.l,
}))
