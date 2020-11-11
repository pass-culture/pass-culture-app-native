/* eslint-disable @typescript-eslint/ban-ts-comment */
import { renderHook } from '@testing-library/react-hooks'
import { Keyboard, KeyboardEventListener, KeyboardEvent, Platform } from 'react-native'

import { useKeyboardEvents } from './useKeyboardEvents'
/**
 * Simulate event calls with addListener and removeListeners mocks
 */
const addKeyboardEventListener = jest.spyOn(Keyboard, 'addListener')
const removeKeyboardEventListener = jest.spyOn(Keyboard, 'removeListener')
const listeners: { [eventName: string]: KeyboardEventListener[] } = {}
// @ts-ignore
addKeyboardEventListener.mockImplementation((eventName, listener) => {
  if (listeners[eventName]) listeners[eventName].push(listener)
  else listeners[eventName] = [listener]
})
removeKeyboardEventListener.mockImplementation((eventName, listener: KeyboardEventListener) => {
  if (listeners[eventName].includes(listener)) {
    listeners[eventName] = listeners[eventName].filter((l) => l !== listener)
  }
})
const onBeforeShowMock = jest.fn()
const onBeforeHideMock = jest.fn()
// @ts-ignore
const keyboardEvent: KeyboardEvent = {
  startCoordinates: { height: 0, screenX: 0, screenY: 800, width: 450 },
  endCoordinates: { height: 300, screenX: 0, screenY: 500, width: 450 },
}
describe('useKeyboardEvents', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('creates event listeners', () => {
    renderHook(useKeyboardEvents, {
      initialProps: { onBeforeHide: jest.fn(), onBeforeShow: jest.fn() },
    })
    expect(addKeyboardEventListener).toHaveBeenCalledTimes(4)
    expect(listeners.keyboardWillShow).toHaveLength(1)
    expect(listeners.keyboardWillHide).toHaveLength(1)
    expect(listeners.keyboardDidShow).toHaveLength(1)
    expect(listeners.keyboardDidHide).toHaveLength(1)
  })
  it('changes the event listeners when the props change', () => {
    const keyboardEventsHook = renderHook(useKeyboardEvents, {
      initialProps: { onBeforeHide: jest.fn(), onBeforeShow: jest.fn() },
    })
    addKeyboardEventListener.mockClear()
    keyboardEventsHook.rerender({ onBeforeShow: onBeforeShowMock, onBeforeHide: onBeforeHideMock })
    expect(removeKeyboardEventListener).toHaveBeenCalledTimes(4)
    expect(addKeyboardEventListener).toHaveBeenCalledTimes(4)
    expect(listeners.keyboardWillShow).toHaveLength(1)
    expect(listeners.keyboardWillHide).toHaveLength(1)
    expect(listeners.keyboardDidShow).toHaveLength(1)
    expect(listeners.keyboardDidHide).toHaveLength(1)
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
        listeners[`keyboardWill${action}`][0](keyboardEvent)
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
      listeners[`keyboardDid${action}`][0](keyboardEvent)
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
      'calls onBefore$action props when calling keyboardDid$action ',
      ({ action, functionMock, expectedKeyboardShown }) => {
        renderHook(useKeyboardEvents, {
          initialProps: {
            onBeforeHide: action === 'Hide' ? functionMock : jest.fn(),
            onBeforeShow: action === 'Show' ? functionMock : jest.fn(),
          },
        })
        listeners[`keyboardDid${action}`][0](keyboardEvent)
        expect(functionMock).toHaveBeenCalledWith({
          keyboardShown: expectedKeyboardShown,
          keyboardHeight: 300,
          coordinates: { start: keyboardEvent.startCoordinates, end: keyboardEvent.endCoordinates },
        })
      }
    )
  })
})
