import { Keyboard } from 'react-native'

import { renderHook } from 'tests/utils'

import { useKeyboardEvents } from './useKeyboardEvents'

const addKeyboardEventListener = jest.spyOn(Keyboard, 'addListener')

const onBeforeShowMock = jest.fn()
const onBeforeHideMock = jest.fn()

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
})
