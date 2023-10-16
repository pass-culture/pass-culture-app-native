import React from 'react'

import { fireEvent, render, screen } from 'tests/utils'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'

import { ModalHeader } from './ModalHeader'

const props = {
  title: 'Testing modal header rendering',
  leftIconAccessibilityLabel: 'Revenir en arrière',
  leftIcon: ArrowPrevious,
  onLeftIconPress: jest.fn(),
  rightIconAccessibilityLabel: 'Fermer la modale',
  rightIcon: Close,
  onRightIconPress: jest.fn(),
}

describe('ModalHeader component', () => {
  describe('left icon', () => {
    it('should be hidden when the icon is not provided', () => {
      const propsWithoutLeftIcon = {
        ...props,
        leftIconAccessibilityLabel: undefined,
        leftIcon: undefined,
        onLeftIconPress: undefined,
      }
      render(<ModalHeader {...propsWithoutLeftIcon} />)
      const leftIcon = screen.queryByTestId('Revenir en arrière')
      expect(leftIcon).not.toBeOnTheScreen()
    })
    it('should be visible when the icon is provided', async () => {
      render(<ModalHeader {...props} />)
      screen.getByTestId('Revenir en arrière') // test existence
      const leftIconButton = await screen.findByTestId(props.leftIconAccessibilityLabel)
      await fireEvent.press(leftIconButton)
      expect(props.onLeftIconPress).toBeCalledTimes(1)
    })
  })
  describe('right icon', () => {
    it('should be hidden when the icon is not provided', () => {
      const propsWithoutRightIcon = {
        ...props,
        rightIconAccessibilityLabel: undefined,
        rightIcon: undefined,
        onRightIconPress: undefined,
      }
      render(<ModalHeader {...propsWithoutRightIcon} />)
      const rightIcon = screen.queryByTestId('Fermer la modale')
      expect(rightIcon).not.toBeOnTheScreen()
    })
    it('should be visible when the icon is provided', async () => {
      render(<ModalHeader {...props} />)
      screen.getByTestId('Fermer la modale') // test existence
      const rightIconButton = await screen.findByTestId(props.rightIconAccessibilityLabel)
      await fireEvent.press(rightIconButton)
      expect(props.onRightIconPress).toBeCalledTimes(1)
    })
  })
})
