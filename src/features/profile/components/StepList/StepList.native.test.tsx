import React from 'react'
import { View } from 'react-native'

import { Step } from 'features/profile/components/Step/Step'
import { render, screen } from 'tests/utils'
import { Typo } from 'ui/theme'

import { StepList } from './StepList'

const children = [
  <Step key={0}>
    <View>
      <Typo.Body>Past</Typo.Body>
    </View>
  </Step>,
  <Step key={1}>
    <View>
      <Typo.Body>Current</Typo.Body>
    </View>
  </Step>,
  <Step key={2}>
    <View>
      <Typo.Body>Future</Typo.Body>
    </View>
  </Step>,
]

describe('<StepList />', () => {
  it('should not render any complete step when active index is 0', () => {
    render(<StepList activeStepIndex={0}>{children}</StepList>)

    expect(screen.queryAllByTestId('vertical-stepper-complete')).toHaveLength(0)
    expect(screen.queryAllByTestId('vertical-stepper-in_progress')).toHaveLength(1)
    expect(screen.queryAllByTestId('vertical-stepper-future')).toHaveLength(2)
  })

  it('should render one complete step, one in progress step and one future step', () => {
    render(<StepList activeStepIndex={1}>{children}</StepList>)

    expect(screen.queryAllByTestId('vertical-stepper-complete')).toHaveLength(1)
    expect(screen.queryAllByTestId('vertical-stepper-in_progress')).toHaveLength(1)
    expect(screen.queryAllByTestId('vertical-stepper-future')).toHaveLength(1)
  })

  it('should render two complete steps, one in progress step and no future step', () => {
    render(<StepList activeStepIndex={2}>{children}</StepList>)

    expect(screen.queryAllByTestId('vertical-stepper-complete')).toHaveLength(2)
    expect(screen.queryAllByTestId('vertical-stepper-in_progress')).toHaveLength(1)
    expect(screen.queryAllByTestId('vertical-stepper-future')).toHaveLength(0)
  })

  it('should warn about active index being greater than children length', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation()

    render(<StepList activeStepIndex={3}>{children}</StepList>)

    expect(warnSpy).toHaveBeenNthCalledWith(
      1,
      '[StepList] - Given (`activeStepIndex`: 3) but children length is 3. Maximum `activeStepIndex` should be 2.'
    )

    warnSpy.mockRestore()
  })
})
