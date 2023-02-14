import React from 'react'
import { Text } from 'react-native'

import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'

import { AppModal } from '../AppModal'

export type AppModalProps = Parameters<typeof AppModal>[0]

export const defaultProps: AppModalProps = {
  title: 'Some title',
  children: <Text>Hello World</Text>,

  visible: true,

  leftIconAccessibilityLabel: undefined,
  leftIcon: undefined,
  onLeftIconPress: undefined,

  rightIconAccessibilityLabel: undefined,
  rightIcon: undefined,
  onRightIconPress: undefined,
}

export const leftIconCallbackMock = jest.fn()
export const leftIconProps = {
  leftIconAccessibilityLabel: 'Revenir à l’étape précédente',
  leftIcon: ArrowPrevious,
  onLeftIconPress: leftIconCallbackMock,
}

export const rightIconCallbackMock = jest.fn()
export const rightIconProps = {
  rightIconAccessibilityLabel: 'Fermer la modale et annuler',
  rightIcon: Close,
  onRightIconPress: rightIconCallbackMock,
}
