import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { MapPinWithCounter } from 'features/venueMap/components/MapPinWithCounter/MapPinWithCounter'

const meta: Meta<typeof MapPinWithCounter> = {
  title: 'features/search/MapPinWithCounter',
  component: MapPinWithCounter,
}
export default meta

type Story = StoryObj<typeof MapPinWithCounter>

export const Default: Story = {
  render: (props) => <MapPinWithCounter {...props} />,
  args: {
    count: 100,
  },
}
