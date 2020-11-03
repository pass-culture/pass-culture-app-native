import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { ArrowPrevious } from 'ui/icons/ArrowPrevious'
import { Close } from 'ui/icons/Close'

import { ModalHeader } from './ModalHeader'

describe('ModalHeader component', () => {
  describe('left icon', () => {
    it('should be hidden when the icon is not provided', () => {
      const { getByTestId } = render(<ModalHeader title="Testing modal header rendering" />)
      try {
        const leftIcon = getByTestId('leftIcon')
        expect(leftIcon).toBeNull()
      } catch (error) {
        expect(error).toBeDefined()
      }
    })
    it('should be visible when the icon is provided', async () => {
      const onLeftPress = jest.fn()
      const { getByTestId, findByTestId } = render(
        <ModalHeader
          title="Testing modal header rendering"
          leftIcon={ArrowPrevious}
          onLeftIconPress={onLeftPress}
        />
      )

      getByTestId('leftIcon')

      const leftIconButton = await findByTestId('leftIconButton')
      await fireEvent.press(leftIconButton)
      expect(onLeftPress).toBeCalledTimes(1)
    })
  })
  describe('right icon', () => {
    it('should be hidden when the icon is not provided', () => {
      const { getByTestId } = render(<ModalHeader title="Testing modal header rendering" />)
      try {
        const rightIcon = getByTestId('rightIcon')
        expect(rightIcon).toBeNull()
      } catch (error) {
        expect(error).toBeDefined()
      }
    })
    it('should be visible when the icon is provided', async () => {
      const onRightPress = jest.fn()
      const { getByTestId, findByTestId } = render(
        <ModalHeader
          title="Testing modal header rendering"
          rightIcon={Close}
          onRightIconPress={onRightPress}
        />
      )

      getByTestId('rightIcon')

      const rightIconButton = await findByTestId('rightIconButton')
      await fireEvent.press(rightIconButton)
      expect(onRightPress).toBeCalledTimes(1)
    })
  })
})
