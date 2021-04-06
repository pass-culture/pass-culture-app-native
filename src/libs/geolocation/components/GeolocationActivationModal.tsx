import { t } from '@lingui/macro'
import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { analytics } from 'libs/analytics'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { BicolorLocationPointer } from 'ui/svg/icons/BicolorLocationPointer'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

type Props = {
  hideGeolocPermissionModal: () => void
  isGeolocPermissionModalVisible: boolean
  onPressGeolocPermissionModalButton: () => void
}

export const GeolocationActivationModal: React.FC<Props> = ({
  isGeolocPermissionModalVisible,
  hideGeolocPermissionModal,
  onPressGeolocPermissionModalButton,
}) => (
  <AppInformationModal
    title={t`Paramètres de localisation`}
    visible={isGeolocPermissionModalVisible}
    onCloseIconPress={hideGeolocPermissionModal}
    testIdSuffix="geoloc-permission-modal">
    <React.Fragment>
      <BicolorLocationPointer
        size={140}
        color={ColorsEnum.GREY_DARK}
        color2={ColorsEnum.GREY_DARK}
      />
      <Spacer.Column numberOfSpaces={2} />
      <InformationText>
        {t`Retrouve toutes les offres autour de chez toi en activant les données de localisation.`}
      </InformationText>
      <Spacer.Column numberOfSpaces={4} />

      <InformationText>
        {Platform.OS === 'android'
          ? t`Tu peux activer ou désactiver cette fonctionnalité dans Autorisations > Localisation.`
          : t`Tu peux activer ou désactiver cette fonctionnalité dans les paramètres de localisation ton téléphone.`}
      </InformationText>
      <Spacer.Column numberOfSpaces={6} />
      <ButtonPrimary
        title={t`Activer la géolocalisation`}
        onPress={() => {
          analytics.logOpenLocationSettings()
          onPressGeolocPermissionModalButton()
        }}
      />
    </React.Fragment>
  </AppInformationModal>
)

const InformationText = styled(Typo.Body)({
  textAlign: 'center',
})
