import { useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { Linking, Platform } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { GeolocPermissionState } from 'libs/location/geolocation/enums'
import { locationStore } from 'libs/locationV2/location.store'
import { remoteIllustrationUrls } from 'shared/illustrations/remoteIllustrations'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { RemoteIllustration } from 'ui/components/RemoteIllustration'
import { Button } from 'ui/designSystem/Button/Button'
import { LocationPointer as InitialLocationPointer } from 'ui/svg/icons/LocationPointer'
import { Typo } from 'ui/theme'

const informationText = Platform.select({
  android: 'Tu peux activer ou désactiver cette fonctionnalité dans Autorisations > Localisation.',
  ios: 'Tu peux activer ou désactiver cette fonctionnalité dans les paramètres de localisation de ton téléphone.',
  web: 'Tu peux activer ou désactiver cette fonctionnalité dans les paramètres de localisation de ton navigateur.',
})
const isNative = Platform.OS === 'android' || Platform.OS === 'ios'

export const GeolocationActivationModal: React.FC = () => {
  const { goBack } = useNavigation<UseNavigationType>()
  const permission = locationStore.hooks.usePermissionState()
  const enableNewVisionUi = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_VISION_UI)

  useFocusEffect(
    useCallback(() => {
      if (permission === GeolocPermissionState.GRANTED) {
        goBack()
      }
    }, [goBack, permission])
  )

  return (
    <AppInformationModal
      title="Paramètres de localisation"
      visible
      onCloseIconPress={goBack}
      testIdSuffix="geoloc-permission-modal">
      {/** Special case where theme.icons.sizes is not used */}
      {enableNewVisionUi ? (
        <RemoteIllustration
          url={remoteIllustrationUrls.worldGlobeSmall}
          backgroundColor="information04"
          size="s"
        />
      ) : (
        <LocationPointer />
      )}
      <FirstInformationText>
        Retrouve toutes les offres autour de chez toi en activant les données de localisation.
      </FirstInformationText>
      <SecondInformationText>{informationText}</SecondInformationText>
      {isNative ? (
        <ButtonWrapper>
          <Button fullWidth wording="Activer la géolocalisation" onPress={onPress} />
        </ButtonWrapper>
      ) : null}
    </AppInformationModal>
  )
}

const onPress = () => {
  void Linking.openSettings()
  void analytics.logOpenLocationSettings()
}

const InformationText = styled(Typo.Body)({
  textAlign: 'center',
})

const FirstInformationText = styled(InformationText)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xxxl,
}))

const SecondInformationText = styled(InformationText)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))

const LocationPointer = styled(InitialLocationPointer).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  size: theme.illustrations.sizes.small,
}))``

const ButtonWrapper = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xl,
}))
