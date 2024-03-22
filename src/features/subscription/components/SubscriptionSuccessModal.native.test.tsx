import React from 'react'

import { SubscriptionTheme } from 'features/subscription/types'
import { render, screen } from 'tests/utils'

import { SubscriptionSuccessModal } from './SubscriptionSuccessModal'

describe('<SubscriptionSuccessModal />', () => {
  it.each(Object.values(SubscriptionTheme))('should render correctly for %s', (theme) => {
    render(<SubscriptionSuccessModal visible theme={theme} dismissModal={jest.fn()} />)

    expect(screen).toMatchSnapshot()
  })
})
