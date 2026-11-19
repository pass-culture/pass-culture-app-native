import React from 'react'

import { Activity } from 'api/gen'
import { VenueSurveyBanner } from 'features/venue/components/VenueOffers/VenueSurveyBanner'
import { render, screen, userEvent } from 'tests/utils'

const user = userEvent.setup()
jest.useFakeTimers()

describe('<VenueSurveyBanner />', () => {
  it('should render nothing when survey config is not found', () => {
    render(<VenueSurveyBanner activity={null} onBeforeNavigate={jest.fn()} />)

    expect(screen.toJSON()).toBeNull()
  })

  it('should render banner content correctly when survey config is found', () => {
    render(<VenueSurveyBanner activity={Activity.BOOKSTORE} onBeforeNavigate={jest.fn()} />)

    expect(screen.getByText(/Un avis sur cette page/)).toBeOnTheScreen()
    expect(
      screen.getByText('Partage-nous tes idées pour améliorer ton expérience de lecture')
    ).toBeOnTheScreen()
    expect(screen.getByText('Donner mon avis (2 min)')).toBeOnTheScreen()
  })

  it('should trigger onBeforeNavigate when pressing the action link', async () => {
    const mockOnBeforeNavigate = jest.fn()
    render(
      <VenueSurveyBanner activity={Activity.BOOKSTORE} onBeforeNavigate={mockOnBeforeNavigate} />
    )

    await user.press(screen.getByText('Donner mon avis (2 min)'))

    expect(mockOnBeforeNavigate).toHaveBeenCalledTimes(1)
  })
})
