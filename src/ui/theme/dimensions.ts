import { Dimensions } from 'react-native'

/** Add 1 pixel to avoid 1 white pixel on androids */
// eslint-disable-next-line no-restricted-properties
export const ScreenWidth = Dimensions.get('window').width + 1
