import { DefaultTheme } from 'styled-components/native'

import { theme } from 'theme'

import { touchableFocusOutline } from './touchableFocusOutline'

jest.mock('react-device-detect', () => ({ isFirefox: false, isSafari: false }))
const mockTheme = theme as DefaultTheme

describe('touchableFocusOutline (web)', () => {
  it('should return empty object when isFocus is false', () => {
    const result = touchableFocusOutline({ theme: mockTheme, isFocus: false })

    expect(result).toEqual({})
  })

  it('should return default focus style when isFocus is true', () => {
    const result = touchableFocusOutline({ theme: mockTheme, isFocus: true })

    expect(result).toMatchObject({
      outlineColor: theme.designSystem.color.outline.default,
      outlineStyle: 'solid',
      outlineWidth: 2,
      outlineOffset: 0,
    })
  })
})
