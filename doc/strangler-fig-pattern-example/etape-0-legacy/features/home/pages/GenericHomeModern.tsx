
/* eslint-disable */
// @ts-nocheck
// prettier-ignore
import React, { FunctionComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'

type GenericHomeProps = {
  // ... props
}

export const OnlineHome: FunctionComponent<GenericHomeProps> = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.modernTitle}>Nouvelle Home en construction (Placeholder)</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#dfd' },
  modernTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: 'green' },
});
