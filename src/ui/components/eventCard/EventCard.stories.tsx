import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { EventCard } from './EventCard'

const meta: ComponentMeta<typeof EventCard> = {
  title: 'ui/EventCard/EventCard',
  component: EventCard,
}
export default meta

const Template: ComponentStory<typeof EventCard> = (props) => <EventCard {...props} />

export const Default = Template.bind({})
Default.storyName = 'EventCard'
Default.args = {
  title: '17h35',
  subtitleLeft: 'VO,3D max',
  subtitleRight: '7,99€',
  isDisabled: false,
}
