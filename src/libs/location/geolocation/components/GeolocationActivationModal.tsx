import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { analytics } from 'libs/analytics/provider'
import { GeolocPermissionState } from 'libs/location/geolocation/enums'
import { useLocation } from 'libs/location/LocationWrapper'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { styledButton } from 'ui/components/buttons/styledButton'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { LocationPointer as InitialLocationPointer } from 'ui/svg/icons/LocationPointer'
import { Typo } from 'ui/theme'

type Props = {
  hideGeolocPermissionModal: () => void
  isGeolocPermissionModalVisible: boolean
  onPressGeolocPermissionModalButton: () => void
}

const informationText = Platform.select({
  android: 'Tu peux activer ou désactiver cette fonctionnalité dans Autorisations > Localisation.',
  ios: 'Tu peux activer ou désactiver cette fonctionnalité dans les paramètres de localisation de ton téléphone.',
  web: 'Tu peux activer ou désactiver cette fonctionnalité dans les paramètres de localisation de ton navigateur.',
})
const isNative = Platform.OS === 'android' || Platform.OS === 'ios'

export const GeolocationActivationModal: React.FC<Props> = ({
  isGeolocPermissionModalVisible,
  hideGeolocPermissionModal,
  onPressGeolocPermissionModalButton,
}) => {
  const { permissionState } = useLocation()
  const callToActionMessage =
    permissionState === GeolocPermissionState.GRANTED
      ? 'Désactiver la géolocalisation'
      : 'Activer la géolocalisation'
  return (
    <AppInformationModal
      title="Paramètres de localisation"
      visible={isGeolocPermissionModalVisible}
      onCloseIconPress={hideGeolocPermissionModal}
      testIdSuffix="geoloc-permission-modal">
      {/** Special case where theme.icons.sizes is not used */}
      <LocationPointer />
      <FirstInformationText>
        Retrouve toutes les offres autour de chez toi en activant les données de localisation.
      </FirstInformationText>
      <SecondInformationText>{informationText}</SecondInformationText>
      {isNative ? (
        <StyledButtonPrimary
          wording={callToActionMessage}
          onPress={() => {
            analytics.logOpenLocationSettings()
            onPressGeolocPermissionModalButton()
          }}
        />
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

const StyledButtonPrimary = styledButton(ButtonPrimary)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xl,
}))
