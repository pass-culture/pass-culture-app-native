import React from 'react'
import { View } from 'react-native'

import { render, screen } from 'tests/utils'
import { Step } from 'ui/components/Step/Step'
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
  it.each([
    { currentStepIndex: 0, complete: 0, inProgress: 1, future: 2 },
    { currentStepIndex: 1, complete: 1, inProgress: 1, future: 1 },
    { currentStepIndex: 2, complete: 2, inProgress: 1, future: 0 },
  ])(
    'should render $complete complete, $inProgress in progress and $future future steps when active index is $currentStepIndex',
    ({ currentStepIndex, complete, inProgress, future }) => {
      render(<StepList currentStepIndex={currentStepIndex}>{children}</StepList>)

      expect(screen.queryAllByTestId('vertical-stepper-complete')).toHaveLength(complete)
      expect(screen.queryAllByTestId('vertical-stepper-in_progress')).toHaveLength(inProgress)
      expect(screen.queryAllByTestId('vertical-stepper-future')).toHaveLength(future)
    }
  )

  it('should warn about active index being greater than children length', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation()

    render(<StepList currentStepIndex={3}>{children}</StepList>)

    expect(warnSpy).toHaveBeenNthCalledWith(
      1,
      '[StepList] - Given (`currentStepIndex`: 3) but children length is 3. Maximum `currentStepIndex` should be 2.'
    )

    warnSpy.mockRestore()
  })
})
