import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { OfferEventCardListSkeleton } from './OfferEventCardListSkeleton'

const meta: Meta<typeof OfferEventCardListSkeleton> = {
  title: 'features/offer/OfferEventCardListSkeleton',
  component: OfferEventCardListSkeleton,
}
export default meta

export const Default: StoryObj<typeof OfferEventCardListSkeleton> = () => (
  <OfferEventCardListSkeleton />
)

Default.args = {}
Default.storyName = 'OfferEventCardListSkeleton'
