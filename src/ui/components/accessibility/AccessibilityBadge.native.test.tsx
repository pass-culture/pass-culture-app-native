import React from 'react'

import { render, screen } from 'tests/utils'

import { HandicapCategory } from '../../../shared/accessibility/getAccessibilityCategoryAndIcon'

import { AccessibilityBadge } from './AccessibilityBadge'

describe('AccessibilityBadge', () => {
  it('should display the validIcon when isValid is true', () => {
    render(<AccessibilityBadge handicap={HandicapCategory.MENTAL} isAccessible />)

    expect(screen.queryByTestId('invalidTestId')).not.toBeOnTheScreen()
    expect(screen.getByTestId('validTestId')).toBeOnTheScreen()
  })

  it('should displat the invalidIcon when isValid is false', () => {
    render(<AccessibilityBadge handicap={HandicapCategory.MENTAL} isAccessible={false} />)

    expect(screen.getByTestId('invalidTestId')).toBeOnTheScreen()
    expect(screen.queryByTestId('validTestId')).not.toBeOnTheScreen()
  })
})
