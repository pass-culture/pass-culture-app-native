import { useNavigation } from '@react-navigation/native'
import React, { FC } from 'react'
import { Platform } from 'react-native'
import Animated, { LinearTransition } from 'react-native-reanimated'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { removeSelectedVenue } from 'features/venueMap/store/venueMapStore'
import { analytics } from 'libs/analytics/provider'
import { LocationMode } from 'libs/location/types'
import { locationSelectors } from 'libs/locationV2/location.store'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Map } from 'ui/svg/icons/Map'
import { Typo } from 'ui/theme'

const isWeb = Platform.OS === 'web'

type Props = {
  shouldDisplayMapButtonText: boolean
  searchId?: string
  setHasBeenClicked: (hasBeenClicked: boolean) => void
}

export const SearchMapButton: FC<Props> = ({
  shouldDisplayMapButtonText,
  searchId,
  setHasBeenClicked,
}) => {
  const { navigate } = useNavigation<UseNavigationType>()

  const handleSeeMapButtonPress = () => {
    removeSelectedVenue()

    setHasBeenClicked(true)
    if (locationSelectors.selectLocationMode() === LocationMode.EVERYWHERE) {
      navigate('VenueMapLocationModal', {
        openedFrom: 'search',
      })
      return
    }

    void analytics.logConsultVenueMap({
      from: 'search',
      searchId,
    })
  }

  if (isWeb) return null

  return (
    <StyledViewContainer
      layout={LinearTransition.springify().damping(15).stiffness(20).duration(1000)}>
      <Container onPress={handleSeeMapButtonPress} accessibilityLabel="Voir la carte">
        <SeeMapIcon />
        {shouldDisplayMapButtonText ? (
          <TextContainer>
            <StyledText>Voir la carte</StyledText>
          </TextContainer>
        ) : null}
      </Container>
    </StyledViewContainer>
  )
}

const StyledViewContainer = styled(Animated.View)(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.designSystem.color.background.brandPrimary,
  borderRadius: theme.designSystem.size.borderRadius.m,
  paddingHorizontal: theme.designSystem.size.spacing.m,
  paddingVertical: theme.designSystem.size.spacing.s,
  overflow: 'hidden',
}))

const Container = styledButton(Touchable)({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
})

const SeeMapIcon = styled(Map).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.inverted,
  size: theme.designSystem.size.icon.m,
  height: theme.designSystem.size.spacing.xxxxl,
  width: theme.designSystem.size.spacing.xxxxl,
}))``

const TextContainer = styled.View(({ theme }) => ({
  marginLeft: theme.designSystem.size.spacing.s,
  alignItems: 'center',
  justifyContent: 'center',
}))
const StyledText = styled(Typo.BodyAccent)(({ theme }) => ({
  color: theme.designSystem.color.text.inverted,
}))
