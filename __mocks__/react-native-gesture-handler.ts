// TODO(PC-39019): no need this mock if Touchables from rngh are no longer used

const rngh = jest.requireActual('react-native-gesture-handler')
const reactNative = jest.requireActual('react-native')

module.exports = {
  ...rngh,
  TouchableOpacity: reactNative.TouchableOpacity,
  TouchableWithoutFeedback: reactNative.TouchableWithoutFeedback,
}
