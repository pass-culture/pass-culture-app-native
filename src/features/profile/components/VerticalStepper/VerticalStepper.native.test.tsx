import React from 'react'

import { render, screen } from 'tests/utils'
import { theme } from 'theme'

import { VerticalStepperVariant } from './types'
import { VerticalStepper } from './VerticalStepper'

const filledStyle = {
  backgroundColor: theme.colors.greyMedium,
  width: 4,
  borderRadius: 2,
}

const dottedStyle = {
  width: 0,
  borderLeftWidth: 4,
  borderLeftColor: theme.colors.greyMedium,
  borderStyle: 'dotted',
}

/**
 * I would like to test that icon is correctly shown, but it's pretty hard...
 */

describe('<VerticalStepper />', () => {
  it('should display correctly when variant is `completed`', () => {
    render(<VerticalStepper variant={VerticalStepperVariant.complete} />)

    expect(screen.getByTestId('top-line')).toHaveStyle(filledStyle)
    expect(screen.getByTestId('bottom-line')).toHaveStyle(filledStyle)
  })

  it('should display correctly when variant is `in_progress`', () => {
    render(<VerticalStepper variant={VerticalStepperVariant.in_progress} />)

    expect(screen.getByTestId('top-line')).toHaveStyle(filledStyle)
    expect(screen.getByTestId('bottom-line')).toHaveStyle(dottedStyle)
  })

  it('should display correctly when variant is `future`', () => {
    render(<VerticalStepper variant={VerticalStepperVariant.future} />)

    expect(screen.getByTestId('top-line')).toHaveStyle(dottedStyle)
    expect(screen.getByTestId('bottom-line')).toHaveStyle(dottedStyle)
  })
})
