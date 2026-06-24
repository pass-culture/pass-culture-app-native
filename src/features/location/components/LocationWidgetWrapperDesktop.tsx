import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { useLocationForLocationWidgetDesktop } from 'features/location/components/useLocationForLocationWidgetDesktop'
import { ScreenOrigin } from 'features/location/enums'
import {
  RootScreenNames,
  UseNavigationType,
} from 'features/navigation/navigators/RootNavigator/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ArrowDown } from 'ui/svg/icons/ArrowDown'
import { LocationPointerAppV2 } from 'ui/svg/icons/LocationPointerAppV2'
import { Typo } from 'ui/theme'

type LocationWidgetWrapperDesktopProps = {
  screenOrigin: ScreenOrigin
}

export const LocationWidgetWrapperDesktop: React.FC<LocationWidgetWrapperDesktopProps> = ({
  screenOrigin,
}) => {
  const { designSystem } = useTheme()
  const {
    title: locationTitle,
    isWidgetHighlighted,
    testId,
  } = useLocationForLocationWidgetDesktop()
  const { navigate } = useNavigation<UseNavigationType>()

  const locationModalScreen: RootScreenNames =
    screenOrigin === ScreenOrigin.HOME ? 'HomeLocationModal' : 'SearchLocationModal'

  const onPressLocationButton = () => {
    navigate(locationModalScreen)
  }

  const locationIcon = isWidgetHighlighted ? (
    <LocationPointerFilled testID="location pointer filled" />
  ) : (
    <LocationPointerNotFilled testID="location pointer not filled" />
  )

  return (
    <WidgetContainer>
      <LocationButton onPress={onPressLocationButton} testID={testId} accessibilityLabel={testId}>
        <NotShrunk>{locationIcon}</NotShrunk>
        <LocationTitle>{locationTitle}</LocationTitle>
        <NotShrunk>
          <ArrowDown size={designSystem.size.icon.s} />
        </NotShrunk>
      </LocationButton>
    </WidgetContainer>
  )
}

const WidgetContainer = styled.View({
  position: 'relative',
  alignSelf: 'center',
})

const LocationButton = styledButton(Touchable)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  height: theme.designSystem.size.spacing.xxl,
  flexShrink: 1,
}))

const NotShrunk = styled.View({
  // We set to undefined to avoid shrink to be applied on the icons - otherwise their size is modified
  flexShrink: undefined,
})

const LocationPointerFilled = styled(LocationPointerAppV2).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  size: theme.designSystem.size.icon.m,
}))``

const LocationPointerNotFilled = styled(LocationPointerAppV2).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.subtle,
  size: theme.designSystem.size.icon.m,
}))``

const LocationTitle = styled(Typo.BodyAccent).attrs({
  numberOfLines: 1,
})(({ theme }) => ({
  flexShrink: 1,
  marginLeft: theme.designSystem.size.spacing.xs,
  marginRight: theme.designSystem.size.spacing.s,
}))
