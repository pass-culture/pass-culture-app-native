import React from 'react'

import { fireEvent, render } from 'tests/utils/web'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'

import { ModalHeader } from './ModalHeader'

const props = {
  title: 'Testing modal header rendering',
  leftIconAccessibilityLabel: 'leftIconButton',
  leftIcon: ArrowPrevious,
  onLeftIconPress: jest.fn(),
  rightIconAccessibilityLabel: 'rightIconButton',
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
      const leftIcon = queryByTestId('leftIcon')
      expect(leftIcon).toBeNull()
    })
    it('should be visible when the icon is provided', async () => {
      const { getByTestId, findByTestId } = render(<ModalHeader {...props} />)
      getByTestId('leftIcon') // test existence
      const leftIconButton = await findByTestId(props.leftIconAccessibilityLabel)
      await fireEvent.click(leftIconButton)
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
      const rightIcon = queryByTestId('rightIcon')
      expect(rightIcon).toBeNull()
    })
    it('should be visible when the icon is provided', async () => {
      const { getByTestId, findByTestId } = render(<ModalHeader {...props} />)
      getByTestId('rightIcon') // test existence
      const rightIconButton = await findByTestId(props.rightIconAccessibilityLabel)
      await fireEvent.click(rightIconButton)
      expect(props.onRightIconPress).toBeCalledTimes(1)
    })
  })
})
