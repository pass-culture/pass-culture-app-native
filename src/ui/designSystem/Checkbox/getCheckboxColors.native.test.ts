import { computedTheme } from 'tests/computedTheme'
import { theme } from 'theme'

import { getCheckboxColors } from './getCheckboxColors'

describe('getCheckboxColors', () => {
  it('should returns correct colors for checked state (container)', () => {
    const result = getCheckboxColors({
      state: ['checked'],
      variant: 'default',
      collapsed: false,
      theme: computedTheme,
      componentType: 'container',
    })

    expect(result).toEqual({
      borderColor: theme.designSystem.color.border.brandPrimary,
      backgroundColor: theme.designSystem.color.background.brandPrimarySelected,
    })
  })

  it('should returns correct colors for checked state (mark)', () => {
    const result = getCheckboxColors({
      state: ['checked'],
      variant: 'default',
      collapsed: false,
      theme: computedTheme,
      componentType: 'mark',
    })

    expect(result).toEqual({
      borderColor: theme.designSystem.color.border.brandPrimary,
      backgroundColor: theme.designSystem.color.background.brandPrimary,
    })
  })

  it('should returns default background when collapsed', () => {
    const result = getCheckboxColors({
      state: ['checked'],
      variant: 'default',
      collapsed: true,
      theme: computedTheme,
      componentType: 'container',
    })

    expect(result.backgroundColor).toBe(theme.designSystem.color.background.default)
  })

  it('should returns disabled background when variant is detailed', () => {
    const result = getCheckboxColors({
      state: ['disabled'],
      variant: 'detailed',
      collapsed: false,
      theme: computedTheme,
      componentType: 'container',
    })

    expect(result.backgroundColor).toBe(theme.designSystem.color.background.disabled)
  })

  it('should returns default background when variant is not detailed (disabled state)', () => {
    const result = getCheckboxColors({
      state: ['disabled'],
      variant: 'default',
      collapsed: false,
      theme: computedTheme,
      componentType: 'container',
    })

    expect(result.backgroundColor).toBe(theme.designSystem.color.background.default)
  })

  it('should returns error border color in error state', () => {
    const result = getCheckboxColors({
      state: ['error'],
      variant: 'default',
      collapsed: false,
      theme: computedTheme,
      componentType: 'container',
    })

    expect(result.borderColor).toBe(theme.designSystem.color.border.error)
  })

  it('should returns default border and background for default state', () => {
    const result = getCheckboxColors({
      state: ['default'],
      variant: 'default',
      collapsed: false,
      theme: computedTheme,
      componentType: 'container',
    })

    expect(result).toEqual({
      borderColor: theme.designSystem.color.border.default,
      backgroundColor: theme.designSystem.color.background.default,
    })
  })

  it('should returns default background when componentType is undefined', () => {
    const result = getCheckboxColors({
      state: ['checked'],
      variant: 'default',
      collapsed: false,
      theme: computedTheme,
    })

    expect(result.backgroundColor).toBe(theme.designSystem.color.background.default)
  })

  it('should returns correct colors for indeterminate state (container)', () => {
    const result = getCheckboxColors({
      state: ['indeterminate'],
      variant: 'default',
      collapsed: false,
      theme: computedTheme,
      componentType: 'container',
    })

    expect(result).toEqual({
      borderColor: theme.designSystem.color.border.brandPrimary,
      backgroundColor: theme.designSystem.color.background.brandPrimarySelected,
    })
  })

  it('should returns correct colors for indeterminate state (mark)', () => {
    const result = getCheckboxColors({
      state: ['indeterminate'],
      variant: 'default',
      collapsed: false,
      theme: computedTheme,
      componentType: 'mark',
    })

    expect(result).toEqual({
      borderColor: theme.designSystem.color.border.brandPrimary,
      backgroundColor: theme.designSystem.color.background.brandPrimary,
    })
  })

  it('should returns default background when indeterminate and collapsed', () => {
    const result = getCheckboxColors({
      state: ['indeterminate'],
      variant: 'default',
      collapsed: true,
      theme: computedTheme,
      componentType: 'container',
    })

    expect(result.backgroundColor).toBe(theme.designSystem.color.background.default)
  })

  it('should returns disabled background when checked and disabled with detailed variant', () => {
    const result = getCheckboxColors({
      state: ['checked', 'disabled'],
      variant: 'detailed',
      collapsed: false,
      theme: computedTheme,
      componentType: 'container',
    })

    expect(result.backgroundColor).toBe(theme.designSystem.color.background.disabled)
  })

  it('should returns disabled background when indeterminate and disabled with detailed variant', () => {
    const result = getCheckboxColors({
      state: ['indeterminate', 'disabled'],
      variant: 'detailed',
      collapsed: false,
      theme: computedTheme,
      componentType: 'container',
    })

    expect(result.backgroundColor).toBe(theme.designSystem.color.background.disabled)
  })
})
