import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { VenueBlockSkeleton } from './VenueBlockSkeleton'

const meta: ComponentMeta<typeof VenueBlockSkeleton> = {
  title: 'features/offer/VenueBlockSkeleton',
  component: VenueBlockSkeleton,
}
export default meta

export const Default: ComponentStory<typeof VenueBlockSkeleton> = () => <VenueBlockSkeleton />

Default.args = {}
