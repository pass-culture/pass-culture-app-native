import { renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { View } from 'react-native'

import { useModalFocusTrap } from 'ui/hooks/useModalFocusTrap'

describe('useModalFocusTrap', () => {
  afterEach(() => {
    document.body.replaceChildren()
  })

  it('should focus the modal then reach its first action with Tab', async () => {
    const user = userEvent.setup()
    const modal = document.createElement('div')
    modal.tabIndex = -1
    const closeButton = document.createElement('button')
    modal.append(closeButton)
    document.body.append(modal)

    renderHook(() => useModalFocusTrap({ current: modal as unknown as View }, true))

    expect(modal).toHaveFocus()

    await user.tab()

    expect(closeButton).toHaveFocus()
  })

  it('should keep Tab navigation inside the modal', () => {
    const modal = document.createElement('div')
    const firstButton = document.createElement('button')
    const lastButton = document.createElement('button')
    modal.append(firstButton, lastButton)
    document.body.append(modal)

    renderHook(() => useModalFocusTrap({ current: modal as unknown as View }, true))

    lastButton.focus()
    globalThis.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }))

    expect(firstButton).toHaveFocus()

    firstButton.focus()
    globalThis.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true }))

    expect(lastButton).toHaveFocus()
  })

  it('should bring focus back to the modal when it escapes', () => {
    const modal = document.createElement('div')
    modal.tabIndex = -1
    const outsideButton = document.createElement('button')
    document.body.append(modal, outsideButton)

    renderHook(() => useModalFocusTrap({ current: modal as unknown as View }, true))

    outsideButton.focus()

    expect(modal).toHaveFocus()
  })

  it('should restore focus to the trigger when the modal closes', () => {
    const trigger = document.createElement('button')
    const modal = document.createElement('div')
    modal.tabIndex = -1
    document.body.append(trigger, modal)
    trigger.focus()
    let restoreFocus: FrameRequestCallback | undefined
    const requestAnimationFrameSpy = jest
      .spyOn(globalThis, 'requestAnimationFrame')
      .mockImplementation((callback) => {
        restoreFocus = callback
        return 0
      })

    const { unmount } = renderHook(() =>
      useModalFocusTrap({ current: modal as unknown as View }, true)
    )
    unmount()
    restoreFocus?.(0)

    expect(trigger).toHaveFocus()

    requestAnimationFrameSpy.mockRestore()
  })
})
