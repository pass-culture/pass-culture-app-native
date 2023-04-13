import { action } from '@storybook/addon-actions'
import { ComponentStory } from '@storybook/react'
import React from 'react'

import { VenueTypeCodeKey } from 'api/gen'

import { VenueCard, VenueCardProps } from './VenueCard'

export default {
  title: 'features/offer/VenueCard',
  component: VenueCard,
}

const Template: ComponentStory<typeof VenueCard> = (props: VenueCardProps) => (
  <VenueCard {...props} />
)

export const Default = Template.bind({})
Default.args = {
  title: 'Title',
  address: 'Ivry-sur-Seine 94200, 16 rue Gabriel Peri',
  distance: '500m',
  venueType: VenueTypeCodeKey.MUSEUM,
  onPress: action('pressed!'),
}
