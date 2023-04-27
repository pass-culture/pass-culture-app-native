import React from 'react'
import { View } from 'react-native'

import { render, screen } from 'tests/utils'
import { theme } from 'theme'

import { StepVariant } from '../VerticalStepper/types'

import { InternalStep } from './InternalStep'

const filledStyle = {
  backgroundColor: theme.colors.greyMedium,
  width: 4,
  borderRadius: 2,
}

const dottedStyle = {
  width: 4,
  borderLeftWidth: 4,
  borderLeftColor: theme.colors.greyMedium,
  borderStyle: 'dotted',
}

describe('<InternalStep />', () => {
  it('should display correctly when variant is `completed`', () => {
    render(
      <InternalStep variant={StepVariant.complete}>
        <View testID="step"></View>
      </InternalStep>
    )

    expect(screen.getByTestId('top-line')).toHaveStyle(filledStyle)
    expect(screen.getByTestId('bottom-line')).toHaveStyle(filledStyle)
    expect(screen.getByTestId('step')).toBeTruthy()
  })

  it('should display correctly when variant is `in_progress`', () => {
    render(
      <InternalStep variant={StepVariant.in_progress}>
        <View testID="step"></View>
      </InternalStep>
    )

    expect(screen.getByTestId('top-line')).toHaveStyle(filledStyle)
    expect(screen.getByTestId('bottom-line')).toHaveStyle(dottedStyle)
    expect(screen.getByTestId('step')).toBeTruthy()
  })

  it('should display correctly when variant is `future`', () => {
    render(
      <InternalStep variant={StepVariant.future}>
        <View testID="step"></View>
      </InternalStep>
    )

    expect(screen.getByTestId('top-line')).toHaveStyle(dottedStyle)
    expect(screen.getByTestId('bottom-line')).toHaveStyle(dottedStyle)
    expect(screen.getByTestId('step')).toBeTruthy()
  })
})
