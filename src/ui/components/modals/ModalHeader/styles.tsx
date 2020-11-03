import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

export interface ModalHeaderStyleClasses {
  container?: ViewStyle
  leftSide?: ViewStyle
  title?: TextStyle
  rightSide?: ViewStyle
}

export const ModalHeaderStyles = StyleSheet.create<ModalHeaderStyleClasses>({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  leftSide: {
    flex: 0.2,
    alignItems: 'center',
  },
  title: {
    flex: 0.6,
    textAlign: 'center',
  },
  rightSide: {
    flex: 0.2,
    alignItems: 'center',
  },
})
