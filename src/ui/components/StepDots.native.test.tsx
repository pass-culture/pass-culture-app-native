import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'

import { render, screen } from 'tests/utils'
import { theme } from 'theme'
import { StepDots } from 'ui/components/StepDots'

describe('<StepDots />', () => {
  describe('three steps with first as current step', () => {
    it('should render first step properly', () => {
      renderThreeStepsFirstIsCurrent()

      const dots = screen.getAllByTestId('dot-icon')

      expect(dots).toHaveLength(3)

      const firstDot = dots[0]

      // @ts-expect-error: because of noUncheckedIndexedAccess
      expect(firstDot.props.borderColor).toEqual(theme.colors.primary)
      // @ts-expect-error: because of noUncheckedIndexedAccess
      expect(firstDot.props.width).toEqual(12)
    })

    it('should render second and third steps properly', () => {
      renderThreeStepsFirstIsCurrent()
      const secondAndThirdDots = screen.getAllByTestId('dot-icon').slice(1)
      secondAndThirdDots.forEach((dot: ReactTestInstance) => {
        expect(dot.props.borderColor).toEqual(theme.colors.greyDark)
        expect(dot.props.width).toEqual(8)
      })
    })
  })

  describe('three steps with second as current step', () => {
    it('should render first step properly', () => {
      renderThreeStepsSecondIsCurrent()
      const firstDot = screen.getAllByTestId('dot-icon')[0]

      // @ts-expect-error: because of noUncheckedIndexedAccess
      expect(firstDot.props.borderColor).toEqual(theme.colors.greenValid)
      // @ts-expect-error: because of noUncheckedIndexedAccess
      expect(firstDot.props.width).toEqual(8)
    })

    it('should render second step properly', () => {
      renderThreeStepsSecondIsCurrent()
      const secondDot = screen.getAllByTestId('dot-icon')[1]

      // @ts-expect-error: because of noUncheckedIndexedAccess
      expect(secondDot.props.borderColor).toEqual(theme.colors.primary)
      // @ts-expect-error: because of noUncheckedIndexedAccess
      expect(secondDot.props.width).toEqual(12)
    })

    it('should render third step properly', () => {
      renderThreeStepsSecondIsCurrent()
      const thirdDot = screen.getAllByTestId('dot-icon')[2]

      // @ts-expect-error: because of noUncheckedIndexedAccess
      expect(thirdDot.props.borderColor).toEqual(theme.colors.greyDark)
      // @ts-expect-error: because of noUncheckedIndexedAccess
      expect(thirdDot.props.width).toEqual(8)
    })
  })

  describe('three steps with last as current step', () => {
    it('should render first and second steps properly', () => {
      renderThreeStepsLastIsCurrent()
      const firstAndSecondDots = screen.getAllByTestId('dot-icon').slice(0, 1)
      firstAndSecondDots.forEach((dot: ReactTestInstance) => {
        expect(dot.props.borderColor).toEqual(theme.colors.greenValid)
        expect(dot.props.width).toEqual(8)
      })
    })

    it('should render second and third steps properly', () => {
      renderThreeStepsLastIsCurrent()
      const thirdDot = screen.getAllByTestId('dot-icon')[2]

      // @ts-expect-error: because of noUncheckedIndexedAccess
      expect(thirdDot.props.borderColor).toEqual(theme.colors.primary)
      // @ts-expect-error: because of noUncheckedIndexedAccess
      expect(thirdDot.props.width).toEqual(12)
    })
  })

  describe('three steps with first and second with neutral color', () => {
    it('should render first and second steps properly', () => {
      render(<StepDots numberOfSteps={3} currentStep={3} withNeutralPreviousStepsColor />)

      const firstAndSecondDots = screen.getAllByTestId('dot-icon').slice(0, 1)
      firstAndSecondDots.forEach((dot: ReactTestInstance) => {
        expect(dot.props.borderColor).toEqual(theme.colors.greyDark)
        expect(dot.props.width).toEqual(8)
      })
    })
  })
})

function renderThreeStepsFirstIsCurrent() {
  return render(<StepDots numberOfSteps={3} currentStep={1} />)
}

function renderThreeStepsSecondIsCurrent() {
  return render(<StepDots numberOfSteps={3} currentStep={2} />)
}

function renderThreeStepsLastIsCurrent() {
  return render(<StepDots numberOfSteps={3} currentStep={3} />)
}
