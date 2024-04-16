import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { CategoryIdEnum } from 'api/gen'

import { HorizontalTile } from './HorizontalTile'

const meta: ComponentMeta<typeof HorizontalTile> = {
  title: 'ui/HorizontalTile',
  component: HorizontalTile,
}
export default meta

const Template: ComponentStory<typeof HorizontalTile> = (props) => <HorizontalTile {...props} />

export const Default = Template.bind({})

const imageUrl =
  'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW'

Default.args = {
  title: 'Harry Potter et l’ordre du phénix',
  categoryId: CategoryIdEnum.CINEMA,
  imageUrl,
  distanceToOffer: '',
  subtitles: ['Séances de cinéma', '14 avril 2024'],
  price: '120€',
}

export const OnVenuePage = Template.bind({})
OnVenuePage.args = {
  title: 'Harry Potter et l’ordre du phénix',
  imageUrl,
  withRightArrow: true,
  subtitles: ['Drame', '1h30'],
}
