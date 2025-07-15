import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { EventCard } from './EventCard'

const meta: Meta<typeof EventCard> = {
  title: 'ui/EventCard/EventCard',
  component: EventCard,
}
export default meta

type Story = StoryObj<typeof EventCard>

export const Default: Story = {
  render: (props) => <EventCard {...props} />,
  args: {
    title: '17h35',
    subtitleLeft: 'VO,3D max',
    subtitleRight: '7,99€',
    isDisabled: false,
  },
  name: 'EventCard',
}
