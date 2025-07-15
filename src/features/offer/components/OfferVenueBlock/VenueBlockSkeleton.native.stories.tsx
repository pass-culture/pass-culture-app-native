import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { VenueBlockSkeleton } from './VenueBlockSkeleton'

const meta: Meta<typeof VenueBlockSkeleton> = {
  title: 'features/offer/VenueBlockSkeleton',
  component: VenueBlockSkeleton,
}
export default meta

type Story = StoryObj<typeof VenueBlockSkeleton>

export const Default: Story = {
  render: () => <VenueBlockSkeleton />,
  name: 'VenueBlockSkeleton',
}
