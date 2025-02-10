import { Platform } from 'react-native'

import { mockSettings } from 'tests/mockSettings'

Platform.OS = 'android'
jest.mock('./Marker/Marker', () => require('./Marker/Marker.android'))
jest.mock('../VenueMapLabel/LabelContainer', () =>
  require('../VenueMapLabel/LabelContainer.android')
)
mockSettings()

require('./VenueMapView.native.test')
