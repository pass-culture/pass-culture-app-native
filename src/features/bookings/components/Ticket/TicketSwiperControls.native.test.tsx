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
    expect(queryByTestId('Revenir à l’étape précédente')).toBeNull()
    queryByTestId('control-component-spacing-prev')
  })

  it('should show prev button if currentStep > 1', () => {
    props.currentStep = 2
    const { queryByTestId } = render(<TicketSwiperControls {...props} />)
    queryByTestId('Revenir à l’étape précédente')
    expect(queryByTestId('control-component-spacing-prev')).toBeNull()
  })

  it('should hide next button if currentStep === numberOfSteps', () => {
    props.currentStep = 4
    const { queryByTestId } = render(<TicketSwiperControls {...props} />)
    expect(queryByTestId('Continuer vers l’étape suivante')).toBeNull()
    queryByTestId('control-component-spacing-next')
  })

  it('should show prev button if currentStep !== 1', () => {
    props.currentStep = 2
    const { queryByTestId } = render(<TicketSwiperControls {...props} />)
    queryByTestId('Continuer vers l’étape suivante')
    expect(queryByTestId('control-component-spacing-next')).toBeNull()
  })
})
