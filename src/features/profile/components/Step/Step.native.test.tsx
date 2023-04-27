import React from 'react'
import { View } from 'react-native'

import { render, screen } from 'tests/utils'
import { theme } from 'theme'

import { StepVariant } from '../VerticalStepper/types'

import { Step } from './Step'

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

describe('<Step />', () => {
  it('should display correctly when variant is `completed`', () => {
    render(
      <Step variant={StepVariant.complete}>
        <View testID="step"></View>
      </Step>
    )

    expect(screen.getByTestId('top-line')).toHaveStyle(filledStyle)
    expect(screen.getByTestId('bottom-line')).toHaveStyle(filledStyle)
    expect(screen.getByTestId('step')).toBeTruthy()
  })

  it('should display correctly when variant is `in_progress`', () => {
    render(
      <Step variant={StepVariant.in_progress}>
        <View testID="step"></View>
      </Step>
    )

    expect(screen.getByTestId('top-line')).toHaveStyle(filledStyle)
    expect(screen.getByTestId('bottom-line')).toHaveStyle(dottedStyle)
    expect(screen.getByTestId('step')).toBeTruthy()
  })

  it('should display correctly when variant is `future`', () => {
    render(
      <Step variant={StepVariant.future}>
        <View testID="step"></View>
      </Step>
    )

    expect(screen.getByTestId('top-line')).toHaveStyle(dottedStyle)
    expect(screen.getByTestId('bottom-line')).toHaveStyle(dottedStyle)
    expect(screen.getByTestId('step')).toBeTruthy()
  })
})
