import React from 'react'

import { SubscribeButtonWithTooltip } from 'features/home/components/SubscribeButtonWithTooltip'
import { render, screen } from 'tests/utils'

describe('<SubscribeButtonWithTooltip />', () => {
  it('should render tooltip when user is not subscribed', () => {
    render(<SubscribeButtonWithTooltip active={false} onPress={jest.fn()} />)

    expect(
      screen.getByText('Suis ce thème pour recevoir de l’actualité sur ce sujet !')
    ).toBeOnTheScreen()
  })

  it('should not render tooltip when user is already subscribed', () => {
    render(<SubscribeButtonWithTooltip active onPress={jest.fn()} />)

    expect(
      screen.queryByText('Suis ce thème pour recevoir de l’actualité sur ce sujet !')
    ).not.toBeOnTheScreen()
  })
})
