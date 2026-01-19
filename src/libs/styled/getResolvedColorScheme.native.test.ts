import { ColorScheme } from 'libs/styled/types'

import { getResolvedColorScheme } from './getResolvedColorScheme'

describe('getResolvedColorScheme', () => {
  it('returns stored light when stored scheme is light', () => {
    expect(getResolvedColorScheme(ColorScheme.LIGHT, 'dark')).toBe(ColorScheme.LIGHT)
  })

  it('returns stored dark when stored scheme is dark', () => {
    expect(getResolvedColorScheme(ColorScheme.DARK, 'light')).toBe(ColorScheme.DARK)
  })

  it('returns light when system scheme is light and stored is system', () => {
    expect(getResolvedColorScheme(ColorScheme.SYSTEM, 'light')).toBe(ColorScheme.LIGHT)
  })

  it('returns dark when system scheme is dark and stored is system', () => {
    expect(getResolvedColorScheme(ColorScheme.SYSTEM, 'dark')).toBe(ColorScheme.DARK)
  })

  it('returns light when system scheme is undefined and stored is system', () => {
    expect(getResolvedColorScheme(ColorScheme.SYSTEM, undefined)).toBe(ColorScheme.LIGHT)
  })
})
