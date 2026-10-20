import { renderHook } from '@testing-library/react'
import { View } from 'react-native'

import { useModalFocusTrap } from 'ui/hooks/useModalFocusTrap'

describe('useModalFocusTrap', () => {
  afterEach(() => {
    document.body.replaceChildren()
  })

  it('should focus the requested initial element', () => {
    const modal = document.createElement('div')
    const closeButton = document.createElement('button')
    closeButton.id = 'close-button'
    modal.append(closeButton)
    document.body.append(modal)

    renderHook(() =>
      useModalFocusTrap({ current: modal as unknown as View }, true, '#close-button')
    )

    expect(closeButton).toHaveFocus()
  })
})
