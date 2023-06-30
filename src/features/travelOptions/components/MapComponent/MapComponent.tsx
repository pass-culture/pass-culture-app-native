import React from 'react'
import { StyleSheet, View, Image } from 'react-native'

interface MapComponentInterface {
  mapUrl: string
}

const MapComponent = ({ mapUrl }: MapComponentInterface) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: mapUrl }} style={styles.webView} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
})

export default MapComponent
