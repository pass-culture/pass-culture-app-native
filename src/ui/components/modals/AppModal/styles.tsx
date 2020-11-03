import { StyleSheet } from 'react-native'

import { ColorsEnum } from 'ui/theme'

export const AppModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  container: {
    flexDirection: 'column',
    backgroundColor: ColorsEnum.WHITE,
    justifyContent: 'flex-start',
    alignItems: 'center',
    minHeight: 300,
    width: '100%',
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
    paddingVertical: 20,
  },
  content: {
    padding: 20,
  },
})
