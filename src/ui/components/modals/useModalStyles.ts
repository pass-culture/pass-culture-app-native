import { useMemo } from 'react'
import { StyleSheet } from 'react-native'

import { ColorsEnum, getSpacing } from 'ui/theme'

const defaultModalStyles = {
  spacing: getSpacing(1),
  height: getSpacing(112),
  maxWidth: getSpacing(125),
  layout: undefined,
}

export interface ModalStyles {
  layout?: 'bottom'
  height?: number
  maxWidth?: number
  spacing?: number
}

export const useModalStyles = (modalStyles: ModalStyles) => {
  const { layout, spacing, height, maxWidth } = { ...defaultModalStyles, ...modalStyles }
  return useMemo(
    () =>
      StyleSheet.create({
        topOffset: {
          ...(layout === 'bottom'
            ? {
                position: 'absolute',
                height,
                margin: 'auto',
                bottom: 0,
              }
            : {}),
        },
        topInset: {
          ...(layout === 'bottom'
            ? {
                marginTop: 0,
              }
            : {}),
        },
        container: {
          width: '100%',
          maxWidth,
          justifyContent: 'center',
          backgroundColor: ColorsEnum.WHITE,
          padding: spacing,
          ...(layout === 'bottom'
            ? {
                marginBottom: 0,
                marginRight: 0,
                marginLeft: 0,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
              }
            : {
                marginHorizontal: 'auto',
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
              }),
        },
        contentContainer: {},
        modaleIcon: {
          marginTop: 20,
        },
      }),
    [layout, spacing, height, maxWidth]
  )
}
