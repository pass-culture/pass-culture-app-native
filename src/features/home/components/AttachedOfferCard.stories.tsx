import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { AttachedOfferCard } from './AttachedOfferCard'
const meta: ComponentMeta<typeof AttachedOfferCard> = {
  title: 'ui/AttachedOfferCard',
  component: AttachedOfferCard,
  decorators: [(Story) => <Story />],
}
export default meta

const Template: ComponentStory<typeof AttachedOfferCard> = (props) => (
  <AttachedOfferCard {...props} />
)

export const Default = Template.bind({})
Default.args = {
  imageUrl:
    'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW',
  price: 'Gratuit',
  categoryText: 'cinéma',
  title: 'La Joconde',
  date: 'Du 12/06 au 24/06',
}
