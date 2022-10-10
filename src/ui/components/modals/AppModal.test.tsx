import React from 'react'

import { fireEvent, render } from 'tests/utils'

import {
  defaultProps,
  AppModalProps,
  leftIconProps,
  leftIconCallbackMock,
  rightIconProps,
  rightIconCallbackMock,
} from './__tests__/fixture'
import { AppModal } from './AppModal'

jest.mock('libs/react-query/usePersistQuery', () => ({
  usePersistQuery: jest.requireActual('react-query').useQuery,
}))

describe('<AppModal />', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  test('with minimal props', () => {
    const renderAPI = render(<AppModal {...defaultProps} />)
    expect(renderAPI).toMatchSnapshot()
  })

  test('when hidden', () => {
    const renderAPI = render(<AppModal {...defaultProps} visible={false} />)
    expect(renderAPI).toMatchSnapshot()
  })

  test('without title', () => {
    const renderAPI = render(<AppModal {...defaultProps} title="" />)
    expect(renderAPI).toMatchSnapshot()
  })

  test('without children', () => {
    const props: AppModalProps = {
      ...defaultProps,
      children: undefined,
    }
    const renderAPI = render(<AppModal {...props} />)
    expect(renderAPI).toMatchSnapshot()
  })

  describe('with long title', () => {
    const longTitle = 'This is a very very very very very very very very long title'

    test('on 2 lines by default', () => {
      const renderAPI = render(<AppModal {...defaultProps} title={longTitle} />)
      expect(renderAPI).toMatchSnapshot()
    })

    test('on 1 line', () => {
      const renderAPI = render(
        <AppModal {...defaultProps} title={longTitle} titleNumberOfLines={1} />
      )
      expect(renderAPI).toMatchSnapshot()
    })
  })

  describe('with scroll', () => {
    test('enabled by default', () => {
      const renderAPI = render(<AppModal {...defaultProps} />)
      expect(renderAPI).toMatchSnapshot()
    })

    test('explicitly enabled', () => {
      const renderAPI = render(<AppModal {...defaultProps} scrollEnabled={true} />)
      expect(renderAPI).toMatchSnapshot()
    })

    test('disabled', () => {
      const renderAPI = render(<AppModal {...defaultProps} scrollEnabled={false} />)
      expect(renderAPI).toMatchSnapshot()
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
})
