import React from 'react'
import { DeviceEventEmitter } from 'react-native'
import { ReactNativeModal } from 'react-native-modal'

import { act, fireEvent, render, screen } from 'tests/utils'

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
  it('with minimal props', () => {
    render(<AppModal {...defaultProps} />)
    expect(screen).toMatchSnapshot()
  })

  it('should hide the modal when set to hidden', () => {
    render(<AppModal {...defaultProps} visible={false} />)
    expect(screen.getByTestId('modal')).toHaveProp('visible', false)
  })

  it('without children', () => {
    const props: AppModalProps = {
      ...defaultProps,
      children: undefined,
    }
    render(<AppModal {...props} />)
    expect(screen).toMatchSnapshot()
  })

  it('without title', () => {
    render(<AppModal {...defaultProps} title="" />)
    const modal = screen.getByTestId('modalHeaderTitle')

    expect(modal.children).toEqual([''])
  })

  describe('with long title', () => {
    const longTitle = 'This is a very very very very very very very very long title'

    it('on 2 lines by default', () => {
      render(<AppModal {...defaultProps} title={longTitle} />)

      const title = screen.getByText('This is a very very very very very very very very long title')

      expect(title).toHaveProp('numberOfLines', 2)
    })

    it('on 1 line', () => {
      render(<AppModal {...defaultProps} title={longTitle} titleNumberOfLines={1} />)

      const title = screen.getByText('This is a very very very very very very very very long title')

      expect(title).toHaveProp('numberOfLines', 1)
    })
  })

  describe('with scroll', () => {
    it('enabled by default', () => {
      render(<AppModal {...defaultProps} />)

      const scrollView = screen.getByTestId('modalScrollView')

      expect(scrollView).toHaveProp('scrollEnabled', true)
    })

    it('explicitly enabled', () => {
      render(<AppModal {...defaultProps} scrollEnabled />)
      const scrollView = screen.getByTestId('modalScrollView')

      expect(scrollView).toHaveProp('scrollEnabled', true)
    })

    it('disabled', () => {
      render(<AppModal {...defaultProps} scrollEnabled={false} />)

      const scrollView = screen.getByTestId('modalScrollView')

      expect(scrollView).toHaveProp('scrollEnabled', false)
    })
  })

  describe('with backdrop', () => {
    it('enabled by default', () => {
      render(<AppModal {...defaultProps} />)
      expect(screen).toMatchSnapshot()
    })

    it('explicitly enabled', () => {
      render(<AppModal {...defaultProps} shouldDisplayOverlay />)
      expect(screen).toMatchSnapshot()
    })

    it('disabled', () => {
      render(<AppModal {...defaultProps} shouldDisplayOverlay={false} />)
      expect(screen).toMatchSnapshot()
    })
  })

  describe('with left icon', () => {
    const props: AppModalProps = {
      ...defaultProps,
      ...leftIconProps,
    }

    it('render', () => {
      render(<AppModal {...props} />)
      expect(screen).toMatchSnapshot()
    })

    it('should call the callback when clicking on left icon', () => {
      render(<AppModal {...defaultProps} {...leftIconProps} />)
      const leftIcon = screen.getByTestId(leftIconProps.leftIconAccessibilityLabel)

      fireEvent.press(leftIcon)

      expect(leftIconCallbackMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('with right icon', () => {
    const props: AppModalProps = {
      ...defaultProps,
      ...rightIconProps,
    }

    it('render', () => {
      render(<AppModal {...props} />)
      expect(screen).toMatchSnapshot()
    })

    it('should call the callback when clicking on right icon', () => {
      render(<AppModal {...defaultProps} {...rightIconProps} />)
      const rightIcon = screen.getByTestId(rightIconProps.rightIconAccessibilityLabel)

      fireEvent.press(rightIcon)

      expect(rightIconCallbackMock).toHaveBeenCalledTimes(1)
    })
  })

  it('on big screen', () => {
    render(<AppModal {...defaultProps} />, {
      theme: { isDesktopViewport: true },
    })
    expect(screen).toMatchSnapshot()
  })

  it('on small screen', () => {
    render(<AppModal {...defaultProps} />, {
      theme: { isDesktopViewport: false, appContentWidth: 400 },
    })
    expect(screen).toMatchSnapshot()
  })

  it('should display fullscreen modal scroll view if isFullscreen = true', () => {
    const modalProps: AppModalProps = { ...defaultProps, isFullscreen: true }
    render(<AppModal {...modalProps} />)

    const fullscreenModalScrollView = screen.getByTestId('fullscreenModalScrollView')

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
      render(<AppModal {...props} />)

      const modal = screen.getByTestId('modal')

      expect(modal.props.onBackdropPress).toBe(props.onBackdropPress)
    })

    it('should be the left icon callback prop when no given backdrop press', () => {
      const props: AppModalProps = {
        ...defaultProps,
        ...leftIconProps,
        ...rightIconProps,
      }
      render(<AppModal {...props} />)

      const modal = screen.getByTestId('modal')

      expect(modal.props.onBackdropPress).toBe(leftIconCallbackMock)
    })

    it('should be the right icon callback prop when no given backdrop press nor left icon callback', () => {
      const props: AppModalProps = {
        ...defaultProps,
        ...rightIconProps,
      }
      render(<AppModal {...props} />)

      const modal = screen.getByTestId('modal')

      expect(modal.props.onBackdropPress).toBe(rightIconCallbackMock)
    })

    it('should do nothing when no given backdrop press nor left nor right icon callback', () => {
      render(<AppModal {...defaultProps} />)

      const modal = screen.getByTestId('modal')

      expect(modal.props.onBackdropPress).toBe(ReactNativeModal.defaultProps.onBackdropPress)
    })
  })

  describe("adapt modal's height", () => {
    it('should have a default height', () => {
      render(<AppModal {...defaultProps} />)

      const modalContainer = screen.getByTestId('modalContainer')

      expect(modalContainer.props.height).toEqual(428)
    })

    it("should adapt to the content's height", () => {
      render(<AppModal {...defaultProps} />)
      const modalContainer = screen.getByTestId('modalContainer')
      const modalScrollView = screen.getByTestId('modalScrollView')

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
        render(<AppModal {...defaultProps} />)
        const modalContainer = screen.getByTestId('modalContainer')

        act(() => {
          DeviceEventEmitter.emit('keyboardWillShow', keyboardEvent)
          DeviceEventEmitter.emit('keyboardDidShow', keyboardEvent)
        })

        expect(modalContainer.props.height).toEqual(720)
      })

      it('hidden', () => {
        render(<AppModal {...defaultProps} />)
        const modalContainer = screen.getByTestId('modalContainer')

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
      render(<AppModal {...defaultProps} />)
      const modalContainer = screen.getByTestId('modalContainer')
      const modalHeader = screen.getByTestId('modalHeader')

      act(() => {
        modalHeader.props.onLayout({ nativeEvent: { layout: { height: 40 } } })
      })

      expect(modalContainer.props.height).toEqual(418)
    })

    it('should display a custom modal header if specified', () => {
      const modalProps: AppModalProps = { ...defaultProps, customModalHeader: <React.Fragment /> }
      render(<AppModal {...modalProps} />)
      const customModalHeader = screen.getByTestId('customModalHeader')

      expect(customModalHeader).toBeTruthy()
    })

    it('should display a fixed modal bottom if specified', () => {
      const modalProps: AppModalProps = { ...defaultProps, fixedModalBottom: <React.Fragment /> }
      render(<AppModal {...modalProps} />)
      const fixedModalBottom = screen.getByTestId('fixedModalBottom')

      expect(fixedModalBottom).toBeTruthy()
    })
  })

  describe('Spacer between header and content', () => {
    it('should display it', () => {
      render(<AppModal {...defaultProps} />)
      expect(screen.getByTestId('spacerBetweenHeaderAndContent')).toBeTruthy()
    })

    it('should not display it', () => {
      const modalProps: AppModalProps = {
        ...defaultProps,
        shouldRemoveSpacerBetweenHeaderAndContent: true,
      }
      render(<AppModal {...modalProps} />)
      expect(screen.queryByTestId('spacerBetweenHeaderAndContent')).toBeNull()
    })
  })
})
