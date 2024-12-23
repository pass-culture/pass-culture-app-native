import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { TutorialTypes } from 'features/tutorial/enums'
import { analytics } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location'
import GeolocationAnimation from 'ui/animations/geolocalisation.json'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const OnboardingGeolocation = () => {
  const isPassForAllEnabled = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_PASS_FOR_ALL)
  const { navigate } = useNavigation<UseNavigationType>()
  const { requestGeolocPermission } = useLocation()

  const navigateToNextScreen = useCallback(() => {
    const nextScreen = isPassForAllEnabled ? 'AgeSelectionFork' : 'EligibleUserAgeSelection'
    navigate(nextScreen, { type: TutorialTypes.ONBOARDING })
  }, [isPassForAllEnabled, navigate])

  const onSkip = useCallback(() => {
    analytics.logOnboardingGeolocationClicked({ type: 'skipped' })
    navigateToNextScreen()
  }, [navigateToNextScreen])

  const onGeolocationButtonPress = useCallback(async () => {
    analytics.logOnboardingGeolocationClicked({ type: 'use_my_position' })
    await requestGeolocPermission({
      onSubmit: navigateToNextScreen,
      onAcceptance: analytics.logHasActivateGeolocFromTutorial,
    })
  }, [navigateToNextScreen, requestGeolocPermission])

  return (
    <GenericInfoPageWhite
      mobileBottomFlex={0.1}
      animation={GeolocationAnimation}
      onSkip={onSkip}
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
