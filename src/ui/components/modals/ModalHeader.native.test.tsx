import React from 'react'

import { fireEvent, render } from 'tests/utils'
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
      const { queryByTestId } = render(<ModalHeader {...propsWithoutLeftIcon} />)
      const leftIcon = queryByTestId('Revenir en arrière')
      expect(leftIcon).toBeNull()
    })
    it('should be visible when the icon is provided', async () => {
      const { getByTestId, findByTestId } = render(<ModalHeader {...props} />)
      getByTestId('Revenir en arrière') // test existence
      const leftIconButton = await findByTestId(props.leftIconAccessibilityLabel)
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
      const { queryByTestId } = render(<ModalHeader {...propsWithoutRightIcon} />)
      const rightIcon = queryByTestId('Fermer la modale')
      expect(rightIcon).toBeNull()
    })
    it('should be visible when the icon is provided', async () => {
      const { getByTestId, findByTestId } = render(<ModalHeader {...props} />)
      getByTestId('Fermer la modale') // test existence
      const rightIconButton = await findByTestId(props.rightIconAccessibilityLabel)
      await fireEvent.press(rightIconButton)
      expect(props.onRightIconPress).toBeCalledTimes(1)
    })
  })
})
