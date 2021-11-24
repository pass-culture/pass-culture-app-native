import { renderHook } from '@testing-library/react-hooks'
import { Keyboard, KeyboardEvent, Platform, DeviceEventEmitter } from 'react-native'

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

    it.each`
      action    | functionMock        | expectedKeyboardShown
      ${'Show'} | ${onBeforeShowMock} | ${true}
      ${'Hide'} | ${onBeforeHideMock} | ${false}
    `(
      'calls onBefore$action props when calling keyboardWill$action ',
      ({ action, functionMock, expectedKeyboardShown }) => {
        renderHook(useKeyboardEvents, {
          initialProps: {
            onBeforeHide: action === 'Hide' ? functionMock : jest.fn(),
            onBeforeShow: action === 'Show' ? functionMock : jest.fn(),
          },
        })
        DeviceEventEmitter.emit(`keyboardWill${action}`, keyboardEvent)
        expect(functionMock).toHaveBeenCalledWith({
          keyboardShown: expectedKeyboardShown,
          keyboardHeight: 300,
          coordinates: { start: keyboardEvent.startCoordinates, end: keyboardEvent.endCoordinates },
        })
      }
    )

    it.each`
      action    | functionMock
      ${'Show'} | ${onBeforeShowMock}
      ${'Hide'} | ${onBeforeHideMock}
    `('does nothing when calling keyboardDid$action ', ({ action, functionMock }) => {
      renderHook(useKeyboardEvents, {
        initialProps: {
          onBeforeHide: action === 'Hide' ? functionMock : jest.fn(),
          onBeforeShow: action === 'Show' ? functionMock : jest.fn(),
        },
      })
      DeviceEventEmitter.emit(`keyboardDid${action}`, keyboardEvent)
      expect(functionMock).not.toHaveBeenCalled()
    })
  })

  describe('on Android', () => {
    beforeEach(() => {
      Platform.OS = 'android'
    })

    it.each`
      action    | functionMock        | expectedKeyboardShown
      ${'Show'} | ${onBeforeShowMock} | ${true}
      ${'Hide'} | ${onBeforeHideMock} | ${false}
    `(
      'calls onBefore$action props when calling keyboardWill$action ',
      ({ action, functionMock, expectedKeyboardShown }) => {
        renderHook(useKeyboardEvents, {
          initialProps: {
            onBeforeHide: action === 'Hide' ? functionMock : jest.fn(),
            onBeforeShow: action === 'Show' ? functionMock : jest.fn(),
          },
        })
        DeviceEventEmitter.emit(`keyboardWill${action}`, keyboardEvent)
        expect(functionMock).toHaveBeenCalledWith({
          keyboardShown: expectedKeyboardShown,
          keyboardHeight: 300,
          coordinates: { start: keyboardEvent.startCoordinates, end: keyboardEvent.endCoordinates },
        })
      }
    )
  })
})
