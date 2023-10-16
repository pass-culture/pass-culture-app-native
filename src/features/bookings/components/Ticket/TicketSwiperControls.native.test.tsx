import React from 'react'

import { TicketSwiperControls } from 'features/bookings/components/Ticket/TicketSwiperControls'
import { render, screen } from 'tests/utils'

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
    render(<TicketSwiperControls {...props} />)
    expect(screen.queryByTestId('Revenir à l’étape précédente')).not.toBeOnTheScreen()
    screen.queryByTestId('control-component-spacing-prev')
  })

  it('should show prev button if currentStep > 1', () => {
    props.currentStep = 2
    render(<TicketSwiperControls {...props} />)
    screen.queryByTestId('Revenir à l’étape précédente')
    expect(screen.queryByTestId('control-component-spacing-prev')).not.toBeOnTheScreen()
  })

  it('should hide next button if currentStep === numberOfSteps', () => {
    props.currentStep = 4
    render(<TicketSwiperControls {...props} />)
    expect(screen.queryByTestId('Continuer vers l’étape suivante')).not.toBeOnTheScreen()
    screen.queryByTestId('control-component-spacing-next')
  })

  it('should show prev button if currentStep !== 1', () => {
    props.currentStep = 2
    render(<TicketSwiperControls {...props} />)
    screen.queryByTestId('Continuer vers l’étape suivante')
    expect(screen.queryByTestId('control-component-spacing-next')).not.toBeOnTheScreen()
  })
})
