/* eslint-disable no-undef */
import 'cross-fetch/polyfill'

/* We disable the following warning, which can be safely ignored as the code
   is not executed on a device :
   "Animated: `useNativeDriver` is not supported because the native animated module is missing. 
   Falling back to JS-based animation." */
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')
