import React from 'react'

import { SubscriptionTheme } from 'features/subscription/types'
import { fireEvent, render, screen } from 'tests/utils'

import { SubscriptionSuccessModal } from './SubscriptionSuccessModal'

describe('<SubscriptionSuccessModal />', () => {
  it.each(Object.values(SubscriptionTheme))('should render correctly for %s', (theme) => {
    render(<SubscriptionSuccessModal visible theme={theme} dismissModal={jest.fn()} />)

    expect(screen).toMatchSnapshot()
  })

  it('should dismiss modal when navigating to notifications settings', () => {
    const dismissModal = jest.fn()
    render(
      <SubscriptionSuccessModal
        visible
        theme={SubscriptionTheme.CINEMA}
        dismissModal={dismissModal}
      />
    )

    fireEvent.press(screen.getByText('Voir mes préférences'))

    expect(dismissModal).toHaveBeenCalledTimes(1)
  })
})
