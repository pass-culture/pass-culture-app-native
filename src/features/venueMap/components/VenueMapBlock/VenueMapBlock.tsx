import React, { FunctionComponent } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { Referrals } from 'features/navigation/RootNavigator/types'
import { VENUE_MAP_BACKGROUND } from 'features/venueMap/components/VenueMapBlock/VenueMapBackground'
import { VENUE_MAP_BACKGROUND_APP_V2 } from 'features/venueMap/components/VenueMapBlock/VenueMapBackgroundAppV2'
import { useInitialVenuesActions } from 'features/venueMap/store/initialVenuesStore'
import { useSelectedVenueActions } from 'features/venueMap/store/selectedVenueStore'
import { analytics } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { Touchable } from 'ui/components/touchable/Touchable'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { getSpacing, Spacer, Typo, TypoDS } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  from: Referrals
  onPress?: VoidFunction
}

export const VenueMapBlock: FunctionComponent<Props> = ({ onPress, from, ...props }) => {
  const focusProps = useHandleFocus()
  const enableAppV2VenueMapBlock = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_APP_V2_VENUE_MAP_BLOCK
  )
  const { removeSelectedVenue } = useSelectedVenueActions()
  const { setInitialVenues } = useInitialVenuesActions()

  const TouchableContainer = onPress ? StyledTouchable : StyledInternalTouchableLink

  const handleOnBeforeNavigate = () => {
    removeSelectedVenue()
    setInitialVenues([])
    analytics.logConsultVenueMap({ from })
  }

  const touchableProps = onPress
    ? { onPress }
    : { navigateTo: { screen: 'VenueMap' }, onBeforeNavigate: handleOnBeforeNavigate }

  return (
    <Container {...props}>
      {enableAppV2VenueMapBlock ? null : (
        <Typo.Title3 {...getHeadingAttrs(2)}>Carte des lieux culturels</Typo.Title3>
      )}
      <Spacer.Column numberOfSpaces={enableAppV2VenueMapBlock ? 2 : 4} />
      <TouchableContainer {...touchableProps} {...focusProps}>
        {enableAppV2VenueMapBlock ? (
          <StyledImageBackground source={VENUE_MAP_BACKGROUND_APP_V2}>
            <CardText>Explore la carte</CardText>
          </StyledImageBackground>
        ) : (
          <StyledImageBackground source={VENUE_MAP_BACKGROUND}>
            <StyledLinearGradient />
            <CardText>Explorer les lieux</CardText>
          </StyledImageBackground>
        )}
      </TouchableContainer>
    </Container>
  )
}

const Container = styled.View({
  marginHorizontal: getSpacing(2),
})

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

const StyledLinearGradient = styled(LinearGradient).attrs({
  useAngle: true,
  angle: 69,
  locations: [0.11, 0.68, 1],
  colors: ['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 0)'],
})(({ theme }) => ({
  height: '100%',
  width: '100%',
  borderRadius: theme.borderRadius.radius,
}))

const CardText = styled(TypoDS.BodyAccent)({
  position: 'absolute',
  left: getSpacing(4),
  bottom: getSpacing(4),
})
