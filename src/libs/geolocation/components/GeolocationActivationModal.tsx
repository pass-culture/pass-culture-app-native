import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { analytics } from 'libs/firebase/analytics'
import { GeolocPermissionState } from 'libs/geolocation/enums'
import { useGeolocation } from 'libs/geolocation/GeolocationWrapper'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { BicolorLocationPointer } from 'ui/svg/icons/BicolorLocationPointer'
import { Spacer, Typo } from 'ui/theme'

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
  const { permissionState } = useGeolocation()
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
      <React.Fragment>
        {/** Special case where theme.icons.sizes is not used */}
        <BicolorLocationPointer size={85} />
        <Spacer.Column numberOfSpaces={10} />
        <InformationText>
          Retrouve toutes les offres autour de chez toi en activant les données de localisation.
        </InformationText>
        <Spacer.Column numberOfSpaces={4} />
        <InformationText>{informationText}</InformationText>
        {isNative ? (
          <React.Fragment>
            <Spacer.Column numberOfSpaces={6} />
            <ButtonPrimary
              wording={callToActionMessage}
              onPress={() => {
                analytics.logOpenLocationSettings()
                onPressGeolocPermissionModalButton()
              }}
            />
          </React.Fragment>
        ) : null}
      </React.Fragment>
    </AppInformationModal>
  )
}

const InformationText = styled(Typo.Body)({
  textAlign: 'center',
})
