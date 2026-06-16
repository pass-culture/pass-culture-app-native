import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { onPressGeolocPermissionModalButton } from 'libs/locationV2/location.methods'
import { locationActions, useLocationV2 } from 'libs/locationV2/location.store'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
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
  const { isPermissionModalVisible } = useLocationV2()

  return (
    <AppInformationModal
      title="Paramètres de localisation"
      visible={isPermissionModalVisible}
      onCloseIconPress={locationActions.hidePermissionModal}
      testIdSuffix="geoloc-permission-modal">
      {/** Special case where theme.icons.sizes is not used */}
      <LocationPointer />
      <FirstInformationText>
        Retrouve toutes les offres autour de chez toi en activant les données de localisation.
      </FirstInformationText>
      <SecondInformationText>{informationText}</SecondInformationText>
      {isNative ? (
        <ButtonWrapper>
          <Button
            fullWidth
            wording="Activer la géolocalisation"
            onPress={onPressGeolocPermissionModalButton}
          />
        </ButtonWrapper>
      ) : null}
    </AppInformationModal>
  )
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
