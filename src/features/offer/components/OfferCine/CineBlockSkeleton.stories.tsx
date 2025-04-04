import type { Meta } from '@storybook/react'
import React from 'react'

import { CineBlockSkeleton } from 'features/offer/components/OfferCine/CineBlockSkeleton'

const meta: Meta<typeof CineBlockSkeleton> = {
  title: 'features/offer/CineBlockSkeleton',
  component: CineBlockSkeleton,
}
export default meta

export const Default = {
  name: 'CineBlockSkeleton',
  render: () => <CineBlockSkeleton />,
}
