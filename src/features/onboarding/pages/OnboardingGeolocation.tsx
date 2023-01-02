import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/firebase/analytics'
import { useGeolocation } from 'libs/geolocation'
import GeolocationAnimation from 'ui/animations/geolocalisation.json'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const OnboardingGeolocation = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { requestGeolocPermission } = useGeolocation()

  const navigateToAgeSelection = useCallback(() => {
    navigate('AgeSelection')
  }, [navigate])

  const onGeolocationButtonPress = useCallback(async () => {
    await requestGeolocPermission({
      onSubmit: navigateToAgeSelection,
      onAcceptance: analytics.logHasActivateGeolocFromTutorial,
    })
  }, [navigateToAgeSelection, requestGeolocPermission])

  return (
    <GenericInfoPageWhite
      fullWidth
      mobileBottomFlex={0.1}
      animation={GeolocationAnimation}
      titleComponent={Typo.Title1}
      onSkip={navigateToAgeSelection}
      title="Découvre les offres près de chez toi">
      <StyledBody>
        Librairie, ciné, festival... Active ta géolocalisation pour retrouver les offres culturelles
        à proximité.
      </StyledBody>
      <Spacer.Flex flex={2} />
      <ButtonContainer>
        <ButtonPrimary wording="Utiliser ma position" onPress={onGeolocationButtonPress} />
      </ButtonContainer>
    </GenericInfoPageWhite>
  )
}

const ButtonContainer = styled.View({
  paddingBottom: getSpacing(10),
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
