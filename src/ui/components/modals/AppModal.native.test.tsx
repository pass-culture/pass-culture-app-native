import React from 'react'
import { DeviceEventEmitter } from 'react-native'
import { ReactNativeModal } from 'react-native-modal'

import { act, render } from 'tests/utils'

import {
  AppModalProps,
  defaultProps,
  leftIconProps,
  rightIconProps,
  leftIconCallbackMock,
  rightIconCallbackMock,
} from './__tests__/fixture'
import { AppModal } from './AppModal'

describe('<AppModal />', () => {
  describe('backdrop callback', () => {
    it('should be the given prop by default', () => {
      const props: AppModalProps = {
        ...defaultProps,
        ...leftIconProps,
        ...rightIconProps,
        onBackdropPress: jest.fn(),
      }
      const { getByTestId } = render(<AppModal {...props} />)

      const modal = getByTestId('modal')

      expect(modal.props.onBackdropPress).toBe(props.onBackdropPress)
    })

    it('should be the left icon callback prop when no given backdrop press', () => {
      const props: AppModalProps = {
        ...defaultProps,
        ...leftIconProps,
        ...rightIconProps,
      }
      const { getByTestId } = render(<AppModal {...props} />)

      const modal = getByTestId('modal')

      expect(modal.props.onBackdropPress).toBe(leftIconCallbackMock)
    })

    it('should be the right icon callback prop when no given backdrop press nor left icon callback', () => {
      const props: AppModalProps = {
        ...defaultProps,
        ...rightIconProps,
      }
      const { getByTestId } = render(<AppModal {...props} />)

      const modal = getByTestId('modal')

      expect(modal.props.onBackdropPress).toBe(rightIconCallbackMock)
    })

    it('should do nothing when no given backdrop press nor left nor right icon callback', () => {
      const { getByTestId } = render(<AppModal {...defaultProps} />)

      const modal = getByTestId('modal')

      expect(modal.props.onBackdropPress).toBe(ReactNativeModal.defaultProps.onBackdropPress)
    })
  })

  describe("adapt modal's height", () => {
    it('should have a default height', () => {
      const { getByTestId } = render(<AppModal {...defaultProps} />)

      const modalContainer = getByTestId('modalContainer')

      expect(modalContainer.props.height).toEqual(428)
    })

    it("should adapt to the content's height", () => {
      const { getByTestId } = render(<AppModal {...defaultProps} />)
      const modalContainer = getByTestId('modalContainer')
      const modalScrollView = getByTestId('modalScrollView')

      act(() => {
        const scrollViewContentWidth = 100
        const scrollViewContentHeight = 200
        modalScrollView.props.onContentSizeChange(scrollViewContentWidth, scrollViewContentHeight)
      })

      expect(modalContainer.props.height).toEqual(328)
    })

    describe('should adapt when virtual keyboard is', () => {
      const keyboardEvent = {
        startCoordinates: { height: 0, screenX: 0, screenY: 800, width: 450 },
        endCoordinates: { height: 300, screenX: 0, screenY: 500, width: 450 },
        duration: 0,
        easing: 'keyboard',
      }

      it('displayed', () => {
        const { getByTestId } = render(<AppModal {...defaultProps} />)
        const modalContainer = getByTestId('modalContainer')

        act(() => {
          DeviceEventEmitter.emit('keyboardWillShow', keyboardEvent)
          DeviceEventEmitter.emit('keyboardDidShow', keyboardEvent)
        })

        expect(modalContainer.props.height).toEqual(720)
      })

      it('hidden', () => {
        const { getByTestId } = render(<AppModal {...defaultProps} />)
        const modalContainer = getByTestId('modalContainer')

        act(() => {
          DeviceEventEmitter.emit('keyboardWillShow', keyboardEvent)
          DeviceEventEmitter.emit('keyboardDidShow', keyboardEvent)
          DeviceEventEmitter.emit('keyboardWillHide', keyboardEvent)
          DeviceEventEmitter.emit('keyboardDidHide', keyboardEvent)
        })

        expect(modalContainer.props.height).toEqual(428)
      })
    })

    it("should adapt to the header's height", () => {
      const { getByTestId } = render(<AppModal {...defaultProps} />)
      const modalContainer = getByTestId('modalContainer')
      const modalHeader = getByTestId('modalHeader')

      act(() => {
        modalHeader.props.onLayout({ nativeEvent: { layout: { height: 40 } } })
      })

      expect(modalContainer.props.height).toEqual(418)
    })

    it('should display a custom modal header if specified', () => {
      const modalProps: AppModalProps = { ...defaultProps, customModalHeader: <React.Fragment /> }
      const { getByTestId } = render(<AppModal {...modalProps} />)
      const customModalHeader = getByTestId('customModalHeader')

      expect(customModalHeader).toBeTruthy()
    })

    it('should display a fixed modal bottom if specified', () => {
      const modalProps: AppModalProps = { ...defaultProps, fixedModalBottom: <React.Fragment /> }
      const { getByTestId } = render(<AppModal {...modalProps} />)
      const fixedModalBottom = getByTestId('fixedModalBottom')

      expect(fixedModalBottom).toBeTruthy()
    })
  })
})
