import { Platform } from 'react-native'

Platform.OS = 'android'
jest.mock('../VenueMapLabel/LabelContainer', () =>
  require('../VenueMapLabel/LabelContainer.android')
)

require('./VenueMapView.native.test')
