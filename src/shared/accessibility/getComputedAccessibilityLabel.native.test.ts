import { getComputedAccessibilityLabel } from './getComputedAccessibilityLabel'

describe('getComputedAccessibilityLabel', () => {
  it('should concatenate non-empty parts with " - "', () => {
    expect(getComputedAccessibilityLabel('Name', 'First name', 'Age')).toBe(
      'Name - First name - Age'
    )
  })

  it('should ignore undefined values', () => {
    expect(getComputedAccessibilityLabel('Name', undefined, 'Age')).toBe('Name - Age')
  })

  it('should ignore null values', () => {
    expect(getComputedAccessibilityLabel('Name', null, 'Age')).toBe('Name - Age')
  })

  it('should ignore empty strings', () => {
    expect(getComputedAccessibilityLabel('Name', '', 'Age')).toBe('Name - Age')
  })

  it('should ignore strings containing only spaces', () => {
    expect(getComputedAccessibilityLabel('Name', '   ', 'Age')).toBe('Name - Age')
  })

  it('should return an empty string when all parts are empty, null, or undefined', () => {
    expect(getComputedAccessibilityLabel('', '   ', null, undefined)).toBe('')
  })

  it('should return the only valid value when a single part is provided', () => {
    expect(getComputedAccessibilityLabel(undefined, 'Label', null)).toBe('Label')
  })

  it('should preserve spacing in valid parts', () => {
    expect(getComputedAccessibilityLabel('  Name  ', '  First name  ')).toBe(
      '  Name   -   First name  '
    )
  })

  it('should return an empty string when called without arguments', () => {
    expect(getComputedAccessibilityLabel()).toBe('')
  })
})
