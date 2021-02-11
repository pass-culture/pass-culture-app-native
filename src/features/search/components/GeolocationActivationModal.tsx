import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

import { AppInformationModal } from 'ui/components/modals/AppInformationModal'

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
    title="Geoloc"
    visible={isGeolocPermissionModalVisible}
    onCloseIconPress={hideGeolocPermissionModal}
    testIdSuffix="geoloc-permission-modal">
    <React.Fragment>
      <Text>Je suis la modale</Text>
      <TouchableOpacity onPress={onPressGeolocPermissionModalButton}>
        <Text>Ouvrir settings</Text>
      </TouchableOpacity>
    </React.Fragment>
  </AppInformationModal>
)
