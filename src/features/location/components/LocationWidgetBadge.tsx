import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { LOCATION_TITLE_MAX_WIDTH } from 'features/location/components/LocationWidget'
import { ScreenOrigin } from 'features/location/enums'
import { getLocationTitle } from 'features/location/helpers/getLocationTitle'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { useLocation } from 'libs/location/location'
import { LocationMode } from 'libs/location/types'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { Typo } from 'ui/theme'

export const LocationWidgetBadge = () => {
  const { place, selectedLocationMode } = useLocation()
  const navigation = useNavigation<UseNavigationType>()

  const locationTitle = getLocationTitle(place, selectedLocationMode)

  const isWidgetHighlighted = selectedLocationMode !== LocationMode.EVERYWHERE

  return (
    <Container highlighted={isWidgetHighlighted}>
      <LocationButton
        onPress={() => navigation.navigate('LocationModal', { screenOrigin: ScreenOrigin.SEARCH })}
        testID="LocationWidgetBadgeButton">
        {isWidgetHighlighted ? (
          <LocationPointerHighlighted testID="location pointer highlighted" />
        ) : (
          <LocationPointerDefault testID="location pointer default" />
        )}
        <LocationTitle>{locationTitle}</LocationTitle>
      </LocationButton>
    </Container>
  )
}
const Container = styled.View<{ highlighted: boolean }>(({ theme, highlighted }) => ({
  flexDirection: 'row',
  height: theme.designSystem.size.spacing.xxl,
  borderRadius: theme.designSystem.size.borderRadius.l,
  paddingHorizontal: theme.designSystem.size.spacing.s,
  borderWidth: 1,
  backgroundColor: highlighted
    ? theme.designSystem.color.background.subtle
    : theme.designSystem.color.background.default,
  borderColor: highlighted
    ? theme.designSystem.color.border.selected
    : theme.designSystem.color.border.default,
}))

const LocationPointerHighlighted = styled(LocationPointer).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  size: theme.icons.sizes.extraSmall,
}))({})

const LocationPointerDefault = styled(LocationPointer).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.designSystem.color.icon.default,
}))``

const LocationTitle = styled(Typo.BodyAccentXs).attrs({
  numberOfLines: 1,
})(({ theme }) => ({
  marginLeft: theme.designSystem.size.spacing.xs,
  maxWidth: LOCATION_TITLE_MAX_WIDTH,
  color: theme.designSystem.color.text.default,
}))

const LocationButton = styled(TouchableOpacity)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  marginLeft: theme.designSystem.size.spacing.xs,
}))
