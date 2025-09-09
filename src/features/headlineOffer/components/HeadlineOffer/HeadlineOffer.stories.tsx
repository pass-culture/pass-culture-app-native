import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { HeadlineOffer } from 'features/headlineOffer/components/HeadlineOffer/HeadlineOffer'
import { SHARE_APP_IMAGE_SOURCE } from 'features/share/components/shareAppImage'
import { VariantsTemplate, type Variants } from 'ui/storybook/VariantsTemplate'

const meta: Meta<typeof HeadlineOffer> = {
  title: 'ui/HeadlineOffer',
  component: HeadlineOffer,
}
export default meta

const variantConfig: Variants<typeof HeadlineOffer> = [
  {
    label: 'HeadlineOffer default',
    props: {
      navigateTo: { screen: 'Offer' },
      category: 'Livre',
      offerTitle: 'One Piece Tome 108',
      imageUrl: SHARE_APP_IMAGE_SOURCE,
      // eslint-disable-next-line local-rules/no-currency-symbols
      price: '7,20\u00a0€',
      distance: '500m',
    },
  },
]

type Story = StoryObj<typeof HeadlineOffer>

const Template = (args: React.ComponentProps<typeof HeadlineOffer>) => (
  <VariantsTemplate variants={variantConfig} Component={HeadlineOffer} defaultProps={args} />
)

export const AllVariants: Story = {
  name: 'HeadlineOffer',
  render: Template,
}
