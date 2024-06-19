import React from 'react'

import { render, screen } from 'tests/utils'

import { AccessibilityAtom } from './AccessibilityAtom'
import { HandicapCategory } from '../../../shared/accessibility/getAccessibilityCategoryAndIcon'

describe('AccessibilityAtom', () => {
  it('should display the validIcon when isValid is true', () => {
    render(<AccessibilityAtom handicap={HandicapCategory.MENTAL} isAccessible />)

    expect(screen.queryByTestId('invalidTestId')).not.toBeOnTheScreen()
    expect(screen.getByTestId('validTestId')).toBeOnTheScreen()
  })

  it('should displat the invalidIcon when isValid is false', () => {
    render(<AccessibilityAtom handicap={HandicapCategory.MENTAL} isAccessible={false} />)

    expect(screen.getByTestId('invalidTestId')).toBeOnTheScreen()
    expect(screen.queryByTestId('validTestId')).not.toBeOnTheScreen()
  })
})
