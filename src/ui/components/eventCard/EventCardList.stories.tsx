import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { theme } from 'theme'

import { EventCardList } from './EventCardList'

const meta: ComponentMeta<typeof EventCardList> = {
  title: 'ui/EventCard/EventCardList',
  component: EventCardList,
}
export default meta

const Template: ComponentStory<typeof EventCardList> = (props) => <EventCardList {...props} />

export const Default = Template.bind({})
Default.storyName = 'EventCardList'
Default.args = {
  data: [
    {
      title: '10h35',
      subtitleLeft: 'VO,3D max',
      subtitleRight: '7,99€',
      isDisabled: false,
      onPress: action('pressed'),
    },
    {
      title: '11h35',
      subtitleLeft: 'VO,3D max',
      subtitleRight: '7,99€',
      isDisabled: false,
      onPress: action('pressed'),
    },
    {
      title: '12h35',
      subtitleLeft: 'VO,3D max',
      subtitleRight: '7,99€',
      isDisabled: false,
      onPress: action('pressed'),
    },
    {
      title: '13h35',
      subtitleLeft: 'VO,3D max',
      subtitleRight: '7,99€',
      isDisabled: false,
      onPress: action('pressed'),
    },
    {
      title: '14h35',
      subtitleLeft: 'VO,3D max',
      subtitleRight: '7,99€',
      isDisabled: false,
      onPress: action('pressed'),
    },
    {
      title: '15h35',
      subtitleLeft: 'VO,3D max',
      subtitleRight: '7,99€',
      isDisabled: false,
      onPress: action('pressed'),
    },
    {
      title: '16h35',
      subtitleLeft: 'VO,3D max',
      subtitleRight: '7,99€',
      isDisabled: false,
      onPress: action('pressed'),
    },
    {
      title: '17h35',
      subtitleLeft: 'VO,3D max',
      subtitleRight: '7,99€',
      isDisabled: false,
      onPress: action('pressed'),
    },
    {
      title: '19h35',
      subtitleLeft: 'VO,3D max',
      subtitleRight: '7,99€',
      isDisabled: false,
      onPress: action('pressed'),
    },
    {
      title: '21h35',
      subtitleLeft: 'VO,3D max',
      subtitleRight: '7,99€',
      isDisabled: false,
      onPress: action('pressed'),
    },
  ],
}

Default.parameters = {
  chromatic: { viewports: [theme.breakpoints.xs, theme.breakpoints.xl] },
}
