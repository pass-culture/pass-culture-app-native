import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'

import { render } from 'tests/utils'
import { StepDots } from 'ui/components/StepDots'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

describe('<StepDots />', () => {
  describe('three steps with first as current step', () => {
    it('should render first step properly', () => {
      const { getAllByTestId } = renderThreeStepsFirstIsCurrent()

      const dots = getAllByTestId('dot-icon')
      expect(dots.length).toBe(3)

      const firstDot = dots[0]
      expect(firstDot.props.borderColor).toEqual(ColorsEnum.PRIMARY)
      expect(firstDot.props.width).toEqual(12)
    })

    it('should render second and third steps properly', () => {
      const { getAllByTestId } = renderThreeStepsFirstIsCurrent()
      const secondAndThirdDots = getAllByTestId('dot-icon').slice(1)
      secondAndThirdDots.forEach((dot: ReactTestInstance) => {
        expect(dot.props.borderColor).toEqual(ColorsEnum.GREY_DARK)
        expect(dot.props.width).toEqual(8)
      })
    })
  })

  describe('three steps with second as current step', () => {
    it('should render first step properly', () => {
      const { getAllByTestId } = renderThreeStepsSecondIsCurrent()
      const firstDot = getAllByTestId('dot-icon')[0]
      expect(firstDot.props.borderColor).toEqual(ColorsEnum.GREEN_VALID)
      expect(firstDot.props.width).toEqual(8)
    })

    it('should render second step properly', () => {
      const { getAllByTestId } = renderThreeStepsSecondIsCurrent()
      const secondDot = getAllByTestId('dot-icon')[1]
      expect(secondDot.props.borderColor).toEqual(ColorsEnum.PRIMARY)
      expect(secondDot.props.width).toEqual(12)
    })

    it('should render third step properly', () => {
      const { getAllByTestId } = renderThreeStepsSecondIsCurrent()
      const thirdDot = getAllByTestId('dot-icon')[2]
      expect(thirdDot.props.borderColor).toEqual(ColorsEnum.GREY_DARK)
      expect(thirdDot.props.width).toEqual(8)
    })
  })

  describe('three steps with last as current step', () => {
    it('should render first and second steps properly', () => {
      const { getAllByTestId } = renderThreeStepsLastIsCurrent()
      const firstAndSecondDots = getAllByTestId('dot-icon').slice(0, 1)
      firstAndSecondDots.forEach((dot: ReactTestInstance) => {
        expect(dot.props.borderColor).toEqual(ColorsEnum.GREEN_VALID)
        expect(dot.props.width).toEqual(8)
      })
    })

    it('should render second and third steps properly', () => {
      const { getAllByTestId } = renderThreeStepsLastIsCurrent()
      const thirdDot = getAllByTestId('dot-icon')[2]
      expect(thirdDot.props.borderColor).toEqual(ColorsEnum.PRIMARY)
      expect(thirdDot.props.width).toEqual(12)
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
