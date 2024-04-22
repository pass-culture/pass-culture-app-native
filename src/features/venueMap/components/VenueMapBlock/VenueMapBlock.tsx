import React, { FunctionComponent } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { VENUE_MAP_BACKGROUND } from 'features/venueMap/components/VenueMapBlock/VenueMapBackground'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { Touchable } from 'ui/components/touchable/Touchable'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  onPress?: VoidFunction
}

export const VenueMapBlock: FunctionComponent<Props> = ({ onPress, ...props }) => {
  const focusProps = useHandleFocus()
  const TouchableContainer = onPress ? StyledTouchable : StyledInternalTouchableLink

  return (
    <Container {...props}>
      <Typo.Title3 {...getHeadingAttrs(2)}>Carte des lieux culturels</Typo.Title3>
      <Spacer.Column numberOfSpaces={4} />
      <TouchableContainer onPress={onPress} navigateTo={{ screen: 'VenueMap' }} {...focusProps}>
        <StyledImageBackground source={VENUE_MAP_BACKGROUND}>
          <StyledLinearGradient />
          <CardText>Explorer les lieux</CardText>
        </StyledImageBackground>
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

const CardText = styled(Typo.ButtonText)({
  position: 'absolute',
  left: getSpacing(4),
  bottom: getSpacing(4),
})
