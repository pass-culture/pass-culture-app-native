import React from 'react'
import { View } from 'react-native'

const MockMapView = (props) => <View {...props} />
const MockMarker = (props) => <View {...props} />
const MockCallout = (props) => <View {...props} />

export default MockMapView
export const Marker = MockMarker
export const Callout = MockCallout
export const PROVIDER_GOOGLE = 'google'
