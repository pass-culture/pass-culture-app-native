import React from 'react'
import MapView from 'react-native-maps'
const MapComponent = ({ currentLocation }: any) => {
  return (
    <MapView
      style={{
        flex: 1,
      }}
      userInterfaceStyle={'light'}
      showsUserLocation={true}
      showsMyLocationButton={false}
      zoomEnabled={true}
      region={{
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}></MapView>
  )
}

export default MapComponent
