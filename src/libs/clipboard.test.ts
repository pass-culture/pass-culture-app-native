import Clipboard from '@react-native-clipboard/clipboard'
import { renderHook } from '@testing-library/react-hooks'

import { useReadClipboard } from 'libs/clipboard'
import { waitFor } from 'tests/utils'

describe('useReadClipboard', () => {
  it('should read the content when not empty', () => {
    Clipboard.setString('hello')

    const onPaste = jest.fn()
    const {
      result: { current: readClipboard },
    } = renderHook(() => useReadClipboard(onPaste))

    readClipboard()

    waitFor(() => {
      expect(onPaste).toBeCalledWith('hello')
    })
  })
  it('should not read the content when empty', () => {
    Clipboard.setString('')

    const onPaste = jest.fn()
    const {
      result: { current: readClipboard },
    } = renderHook(() => useReadClipboard(onPaste))

    readClipboard()

    waitFor(() => {
      expect(onPaste).not.toBeCalled()
    })
  })
})
