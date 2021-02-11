import { Dimensions } from 'react-native'

/** Add 1 pixel to avoid 1 white pixel on androids */
export const ScreenWidth = Dimensions.get('window').width + 1
