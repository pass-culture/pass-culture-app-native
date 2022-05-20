import React from 'react'

import { TicketSwiperControls } from 'features/bookings/components/Ticket/TicketSwiperControls'
import { render } from 'tests/utils'

const props = {
  prevTitle: 'prev',
  nextTitle: 'next',
  onPressPrev: jest.fn(),
  onPressNext: jest.fn(),
  numberOfSteps: 4,
  currentStep: 1,
}

describe('<TicketSwiperControls/>', () => {
  it('should hide prev button if currentStep === 1', () => {
    const { queryByTestId } = render(<TicketSwiperControls {...props} />)
    expect(queryByTestId('control-button-prev')).toBeFalsy()
    queryByTestId('control-component-spacing-prev')
  })

  it('should show prev button if currentStep > 1', () => {
    props.currentStep = 2
    const { queryByTestId } = render(<TicketSwiperControls {...props} />)
    queryByTestId('control-button-prev')
    expect(queryByTestId('control-component-spacing-prev')).toBeFalsy()
  })

  it('should hide next button if currentStep === numberOfSteps', () => {
    props.currentStep = 4
    const { queryByTestId } = render(<TicketSwiperControls {...props} />)
    expect(queryByTestId('control-button-next')).toBeFalsy()
    queryByTestId('control-component-spacing-next')
  })

  it('should show prev button if currentStep !== 1', () => {
    props.currentStep = 2
    const { queryByTestId } = render(<TicketSwiperControls {...props} />)
    queryByTestId('control-button-next')
    expect(queryByTestId('control-component-spacing-next')).toBeFalsy()
  })
})
