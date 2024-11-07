import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { CineBlockSkeleton } from 'features/offer/components/OfferCine/CineBlockSkeleton'

const meta: ComponentMeta<typeof CineBlockSkeleton> = {
  title: 'features/offer/CineBlockSkeleton',
  component: CineBlockSkeleton,
}
export default meta

export const Default: ComponentStory<typeof CineBlockSkeleton> = (props) => (
  <CineBlockSkeleton {...props} />
)

Default.args = {}
Default.storyName = 'CineBlockSkeleton'
