import React from 'react'

import { render, screen } from 'tests/utils'

import { HandicapCategory } from '../../../shared/accessibility/getAccessibilityCategoryAndIcon'

import { AccessibilityBadge } from './AccessibilityBadge'

describe('AccessibilityBadge', () => {
  it('should display the validIcon when isValid is true', () => {
    render(<AccessibilityBadge handicap={HandicapCategory.MENTAL} isAccessible />)

    expect(screen.queryByTestId('invalid-icon')).not.toBeOnTheScreen()
    expect(screen.getByTestId('valid-icon')).toBeOnTheScreen()
  })

  it('should displat the invalidIcon when isValid is false', () => {
    render(<AccessibilityBadge handicap={HandicapCategory.MENTAL} isAccessible={false} />)

    expect(screen.getByTestId('invalid-icon')).toBeOnTheScreen()
    expect(screen.queryByTestId('valid-icon')).not.toBeOnTheScreen()
  })
})
