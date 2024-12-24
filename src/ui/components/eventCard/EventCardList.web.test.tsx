import React from 'react'

import { render, screen } from 'tests/utils/web'
import { EventCardList } from 'ui/components/eventCard/EventCardList'

describe('EventCardList', () => {
  it('should render correctly on mobile viewport', async () => {
    render(
      <EventCardList
        data={[
          {
            title: '10h35',
            subtitleLeft: 'VO,3D max',
            subtitleRight: '7,99€',
            isDisabled: false,
            onPress: jest.fn(),
          },
        ]}
      />,
      { theme: { isDesktopViewport: false, isMobileViewport: true } }
    )
    await screen.findByText('VO,3D max')

    expect(screen.getByTestId('mobile-event-card-list')).toBeInTheDocument()
  })

  it('should render correctly on desktop viewport', async () => {
    render(
      <EventCardList
        data={[
          {
            title: '10h35',
            subtitleLeft: 'VO,3D max',
            subtitleRight: '7,99€',
            isDisabled: false,
            onPress: jest.fn(),
          },
        ]}
      />,
      { theme: { isDesktopViewport: true, isMobileViewport: false } }
    )
    await screen.findByText('VO,3D max')

    expect(screen.getByTestId('desktop-event-card-list')).toBeInTheDocument()
  })
})
