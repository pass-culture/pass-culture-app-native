import { Keyboard, KeyboardEvent, Platform, DeviceEventEmitter } from 'react-native'

import { renderHook } from 'tests/utils'

import { useKeyboardEvents } from './useKeyboardEvents'

const addKeyboardEventListener = jest.spyOn(Keyboard, 'addListener')

const onBeforeShowMock = jest.fn()
const onBeforeHideMock = jest.fn()

const keyboardEvent: KeyboardEvent = {
  startCoordinates: { height: 0, screenX: 0, screenY: 800, width: 450 },
  endCoordinates: { height: 300, screenX: 0, screenY: 500, width: 450 },
  duration: 0,
  easing: 'keyboard',
}

describe('useKeyboardEvents', () => {
  it('creates event listeners', () => {
    renderHook(useKeyboardEvents, {
      initialProps: { onBeforeHide: jest.fn(), onBeforeShow: jest.fn() },
    })

    expect(addKeyboardEventListener).toHaveBeenCalledTimes(4)
    expect(addKeyboardEventListener).toHaveBeenCalledWith('keyboardWillShow', expect.any(Function))
    expect(addKeyboardEventListener).toHaveBeenCalledWith('keyboardDidShow', expect.any(Function))
    expect(addKeyboardEventListener).toHaveBeenCalledWith('keyboardWillHide', expect.any(Function))
    expect(addKeyboardEventListener).toHaveBeenCalledWith('keyboardDidHide', expect.any(Function))
  })

  it('changes the event listeners when the props change', () => {
    const keyboardEventsHook = renderHook(useKeyboardEvents, {
      initialProps: { onBeforeHide: jest.fn(), onBeforeShow: jest.fn() },
    })
    addKeyboardEventListener.mockClear()
    keyboardEventsHook.rerender({ onBeforeShow: onBeforeShowMock, onBeforeHide: onBeforeHideMock })

    expect(addKeyboardEventListener).toHaveBeenCalledTimes(4)
    expect(addKeyboardEventListener).toHaveBeenCalledWith('keyboardWillShow', expect.any(Function))
    expect(addKeyboardEventListener).toHaveBeenCalledWith('keyboardDidShow', expect.any(Function))
    expect(addKeyboardEventListener).toHaveBeenCalledWith('keyboardWillHide', expect.any(Function))
    expect(addKeyboardEventListener).toHaveBeenCalledWith('keyboardDidHide', expect.any(Function))
  })

  describe('on iOS', () => {
    beforeEach(() => {
      Platform.OS = 'ios'
    })

    it('calls onBeforeShow props when calling keyboardWillShow', () => {
      renderHook(useKeyboardEvents, {
        initialProps: {
          onBeforeHide: jest.fn(),
          onBeforeShow: onBeforeShowMock,
        },
      })
      DeviceEventEmitter.emit(`keyboardWillShow`, keyboardEvent)

      expect(onBeforeShowMock).toHaveBeenCalledWith({
        keyboardShown: true,
        keyboardHeight: 300,
        coordinates: { start: keyboardEvent.startCoordinates, end: keyboardEvent.endCoordinates },
      })
    })

    it('calls onBeforeHide props when calling keyboardWillHide', () => {
      renderHook(useKeyboardEvents, {
        initialProps: {
          onBeforeHide: onBeforeHideMock,
          onBeforeShow: jest.fn(),
        },
      })
      DeviceEventEmitter.emit(`keyboardWillHide`, keyboardEvent)

      expect(onBeforeHideMock).toHaveBeenCalledWith({
        keyboardShown: false,
        keyboardHeight: 300,
        coordinates: { start: keyboardEvent.startCoordinates, end: keyboardEvent.endCoordinates },
      })
    })

    it('does nothing when calling keyboardDidShow', () => {
      renderHook(useKeyboardEvents, {
        initialProps: {
          onBeforeHide: jest.fn(),
          onBeforeShow: onBeforeShowMock,
        },
      })
      DeviceEventEmitter.emit(`keyboardDidShow`, keyboardEvent)

      expect(onBeforeShowMock).not.toHaveBeenCalled()
    })

    it('does nothing when calling keyboardDidHide', () => {
      renderHook(useKeyboardEvents, {
        initialProps: {
          onBeforeHide: onBeforeHideMock,
          onBeforeShow: jest.fn(),
        },
      })
      DeviceEventEmitter.emit(`keyboardDidHide`, keyboardEvent)

      expect(onBeforeHideMock).not.toHaveBeenCalled()
    })
  })

  describe('on Android', () => {
    beforeEach(() => {
      Platform.OS = 'android'
    })

    it('calls onBeforeShow props when calling keyboardWillShow', () => {
      renderHook(useKeyboardEvents, {
        initialProps: {
          onBeforeHide: jest.fn(),
          onBeforeShow: onBeforeShowMock,
        },
      })
      DeviceEventEmitter.emit(`keyboardWillShow`, keyboardEvent)

      expect(onBeforeShowMock).toHaveBeenCalledWith({
        keyboardShown: true,
        keyboardHeight: 300,
        coordinates: { start: keyboardEvent.startCoordinates, end: keyboardEvent.endCoordinates },
      })
    })

    it('calls onBeforeHide props when calling keyboardWillHide', () => {
      renderHook(useKeyboardEvents, {
        initialProps: {
          onBeforeHide: onBeforeHideMock,
          onBeforeShow: jest.fn(),
        },
      })
      DeviceEventEmitter.emit(`keyboardWillHide`, keyboardEvent)

      expect(onBeforeHideMock).toHaveBeenCalledWith({
        keyboardShown: false,
        keyboardHeight: 300,
        coordinates: { start: keyboardEvent.startCoordinates, end: keyboardEvent.endCoordinates },
      })
    })
  })
})
