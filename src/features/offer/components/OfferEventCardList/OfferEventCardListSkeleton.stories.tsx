import type { Meta, StoryObj } from '@storybook/react-vite'

import { OfferEventCardListSkeleton } from './OfferEventCardListSkeleton'

const meta: Meta<typeof OfferEventCardListSkeleton> = {
  title: 'features/offer/OfferEventCardListSkeleton',
  component: OfferEventCardListSkeleton,
}
export default meta

type Story = StoryObj<typeof OfferEventCardListSkeleton>

export const Default: Story = {
  args: {},
  name: 'OfferEventCardListSkeleton',
}
