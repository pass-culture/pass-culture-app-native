import React from 'react'

import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { OnboardingSubscription } from 'features/subscription/page/OnboardingSubscription'
import { fireEvent, render, screen } from 'tests/utils'

describe('OnboardingSubscription', () => {
  it('should render correctly', () => {
    render(<OnboardingSubscription />)

    expect(screen).toMatchSnapshot()
  })

  it('should go back when user presses "Non merci"', () => {
    render(<OnboardingSubscription />)

    fireEvent.press(screen.getByText('Non merci'))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should toggle theme when user presses a category button', () => {
    render(<OnboardingSubscription />)

    fireEvent.press(screen.getByLabelText('Activités créatives'))

    expect(screen.getByLabelText('Activités créatives')).toHaveAccessibilityState({ checked: true })
  })
})
