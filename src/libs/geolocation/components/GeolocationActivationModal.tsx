import { t } from '@lingui/macro'
import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { analytics } from 'libs/analytics'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { BicolorLocationPointerDeprecated } from 'ui/svg/icons/BicolorLocationPointer_deprecated'
import { Spacer, Typo } from 'ui/theme'

import { GeolocPermissionState } from '../enums'
import { useGeolocation } from '../GeolocationWrapper'

type Props = {
  hideGeolocPermissionModal: () => void
  isGeolocPermissionModalVisible: boolean
  onPressGeolocPermissionModalButton: () => void
}

const informationText = Platform.select({
  android: t`Tu peux activer ou désactiver cette fonctionnalité dans Autorisations > Localisation.`,
  ios: t`Tu peux activer ou désactiver cette fonctionnalité dans les paramètres de localisation de ton téléphone.`,
  web: t`Tu peux activer ou désactiver cette fonctionnalité dans les paramètres de localisation de ton navigateur.`,
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
      ? t`Désactiver la géolocalisation`
      : t`Activer la géolocalisation`
  return (
    <AppInformationModal
      title={t`Paramètres de localisation`}
      visible={isGeolocPermissionModalVisible}
      onCloseIconPress={hideGeolocPermissionModal}
      testIdSuffix="geoloc-permission-modal">
      <React.Fragment>
        <BicolorLocationPointerDeprecated size={140} />
        <Spacer.Column numberOfSpaces={2} />
        <InformationText>
          {t`Retrouve toutes les offres autour de chez toi en activant les données de localisation.`}
        </InformationText>
        <Spacer.Column numberOfSpaces={4} />
        <InformationText>{informationText}</InformationText>
        <Spacer.Column numberOfSpaces={6} />
        {isNative ? (
          <ButtonPrimary
            title={callToActionMessage}
            onPress={() => {
              analytics.logOpenLocationSettings()
              onPressGeolocPermissionModalButton()
            }}
          />
        ) : null}
      </React.Fragment>
    </AppInformationModal>
  )
}

const InformationText = styled(Typo.Body)({
  textAlign: 'center',
})
