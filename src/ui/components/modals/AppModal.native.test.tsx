import React from 'react'
import { DeviceEventEmitter } from 'react-native'
import { ReactNativeModal } from 'react-native-modal'

import { act, fireEvent, render } from 'tests/utils'

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
  test('with minimal props', () => {
    const renderAPI = render(<AppModal {...defaultProps} />)
    expect(renderAPI).toMatchSnapshot()
  })

  test('should hide the modal when set to hidden', () => {
    const { getByTestId } = render(<AppModal {...defaultProps} visible={false} />)
    const modal = getByTestId('modal')

    expect(modal).toHaveProp('visible', false)
  })

  test('without children', () => {
    const props: AppModalProps = {
      ...defaultProps,
      children: undefined,
    }
    const renderAPI = render(<AppModal {...props} />)
    expect(renderAPI).toMatchSnapshot()
  })

  test('without title', () => {
    const { getByTestId } = render(<AppModal {...defaultProps} title="" />)
    const modal = getByTestId('modalHeaderTitle')

    expect(modal.children).toEqual([''])
  })

  describe('with long title', () => {
    const longTitle = 'This is a very very very very very very very very long title'

    test('on 2 lines by default', () => {
      const { getByText } = render(<AppModal {...defaultProps} title={longTitle} />)

      const title = getByText('This is a very very very very very very very very long title')

      expect(title).toHaveProp('numberOfLines', 2)
    })

    test('on 1 line', () => {
      const { getByText } = render(
        <AppModal {...defaultProps} title={longTitle} titleNumberOfLines={1} />
      )

      const title = getByText('This is a very very very very very very very very long title')

      expect(title).toHaveProp('numberOfLines', 1)
    })
  })

  describe('with scroll', () => {
    test('enabled by default', () => {
      const { getByTestId } = render(<AppModal {...defaultProps} />)

      const scrollView = getByTestId('modalScrollView')

      expect(scrollView).toHaveProp('scrollEnabled', true)
    })

    test('explicitly enabled', () => {
      const { getByTestId } = render(<AppModal {...defaultProps} scrollEnabled={true} />)
      const scrollView = getByTestId('modalScrollView')

      expect(scrollView).toHaveProp('scrollEnabled', true)
    })

    test('disabled', () => {
      const { getByTestId } = render(<AppModal {...defaultProps} scrollEnabled={false} />)

      const scrollView = getByTestId('modalScrollView')

      expect(scrollView).toHaveProp('scrollEnabled', false)
    })
  })

  describe('with backdrop', () => {
    test('enabled by default', () => {
      const renderAPI = render(<AppModal {...defaultProps} />)
      expect(renderAPI).toMatchSnapshot()
    })

    test('explicitly enabled', () => {
      const renderAPI = render(<AppModal {...defaultProps} shouldDisplayOverlay={true} />)
      expect(renderAPI).toMatchSnapshot()
    })

    test('disabled', () => {
      const renderAPI = render(<AppModal {...defaultProps} shouldDisplayOverlay={false} />)
      expect(renderAPI).toMatchSnapshot()
    })
  })

  describe('with left icon', () => {
    const props: AppModalProps = {
      ...defaultProps,
      ...leftIconProps,
    }

    test('render', () => {
      const renderAPI = render(<AppModal {...props} />)
      expect(renderAPI).toMatchSnapshot()
    })

    it('should call the callback when clicking on left icon', () => {
      const { getByTestId } = render(<AppModal {...defaultProps} {...leftIconProps} />)
      const leftIcon = getByTestId(leftIconProps.leftIconAccessibilityLabel)

      fireEvent.press(leftIcon)

      expect(leftIconCallbackMock).toHaveBeenCalled()
    })
  })

  describe('with right icon', () => {
    const props: AppModalProps = {
      ...defaultProps,
      ...rightIconProps,
    }

    test('render', () => {
      const renderAPI = render(<AppModal {...props} />)
      expect(renderAPI).toMatchSnapshot()
    })

    it('should call the callback when clicking on right icon', () => {
      const { getByTestId } = render(<AppModal {...defaultProps} {...rightIconProps} />)
      const rightIcon = getByTestId(rightIconProps.rightIconAccessibilityLabel)

      fireEvent.press(rightIcon)

      expect(rightIconCallbackMock).toHaveBeenCalled()
    })
  })

  test('on big screen', () => {
    const renderAPI = render(<AppModal {...defaultProps} />, {
      theme: { isDesktopViewport: true },
    })
    expect(renderAPI).toMatchSnapshot()
  })

  test('on small screen', () => {
    const renderAPI = render(<AppModal {...defaultProps} />, {
      theme: { isDesktopViewport: false, appContentWidth: 400 },
    })
    expect(renderAPI).toMatchSnapshot()
  })

  it('should display fullscreen modal scroll view if isFullscreen = true', () => {
    const modalProps: AppModalProps = { ...defaultProps, isFullscreen: true }
    const { getByTestId } = render(<AppModal {...modalProps} />)

    const fullscreenModalScrollView = getByTestId('fullscreenModalScrollView')

    expect(fullscreenModalScrollView).toBeTruthy()
  })

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
