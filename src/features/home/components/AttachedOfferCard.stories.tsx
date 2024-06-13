import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { AttachedOfferCard } from './AttachedOfferCard'
const meta: ComponentMeta<typeof AttachedOfferCard> = {
  title: 'ui/AttachedOfferCard',
  component: AttachedOfferCard,
}
export default meta

const Template: ComponentStory<typeof AttachedOfferCard> = (props) => (
  <AttachedOfferCard {...props} />
)

export const AttachedOfferCardExclusivity = Template.bind({})
AttachedOfferCardExclusivity.args = {
  showImage: true,
  imageUrl:
    'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW',
  price: 'Gratuit',
  categoryText: 'Cinéma',
  title: 'La Joconde',
}

export const AttachedOfferCardHighlight = Template.bind({})
AttachedOfferCardHighlight.args = {
  categoryText: 'Cinéma',
  title: 'La Joconde',
  date: 'Du 12/06 au 24/06',
  withRightArrow: true,
}
