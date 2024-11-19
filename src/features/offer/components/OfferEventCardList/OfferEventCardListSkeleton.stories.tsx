import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { OfferEventCardListSkeleton } from './OfferEventCardListSkeleton'

const meta: ComponentMeta<typeof OfferEventCardListSkeleton> = {
  title: 'features/offer/OfferEventCardListSkeleton',
  component: OfferEventCardListSkeleton,
}
export default meta

export const Default: ComponentStory<typeof OfferEventCardListSkeleton> = () => (
  <OfferEventCardListSkeleton />
)

Default.args = {}
Default.storyName = 'OfferEventCardListSkeleton'
