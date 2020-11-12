import { Platform } from 'react-native'

import { AvoidingKeyboardContainer as AvoidingKeyboardContainerAndroid } from './AvoidingKeyboardContainer.android'
import { AvoidingKeyboardContainer as AvoidingKeyboardContainerIos } from './AvoidingKeyboardContainer.ios'

export const AvoidingKeyboardContainer =
  Platform.OS === 'ios' ? AvoidingKeyboardContainerIos : AvoidingKeyboardContainerAndroid
