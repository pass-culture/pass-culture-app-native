import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { EventCard } from './EventCard'

const meta: ComponentMeta<typeof EventCard> = {
  title: 'ui/EventCard',
  component: EventCard,
}
export default meta

const Template: ComponentStory<typeof EventCard> = (props) => <EventCard {...props} />

export const EventCardDefault = Template.bind({})
EventCardDefault.args = {
  title: '17h35',
  subtitleLeft: 'VO,3D max',
  subtitleRight: '7,99€',
  isDisabled: false,
}
