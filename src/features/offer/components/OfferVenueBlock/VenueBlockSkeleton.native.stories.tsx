import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { VenueBlockSkeleton } from './VenueBlockSkeleton'

const meta: Meta<typeof VenueBlockSkeleton> = {
  title: 'features/offer/VenueBlockSkeleton',
  component: VenueBlockSkeleton,
}
export default meta

export const Default: StoryObj<typeof VenueBlockSkeleton> = () => <VenueBlockSkeleton />

Default.args = {}
Default.storyName = 'VenueBlockSkeleton'
