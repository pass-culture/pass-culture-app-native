import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { GeolocationButton } from './GeolocationButton'

export default {
  title: 'Features/Search/GeolocationButton',
  component: GeolocationButton,
} as ComponentMeta<typeof GeolocationButton>

const Template: ComponentStory<typeof GeolocationButton> = (props) => (
  <GeolocationButton {...props} />
)

export const Default = Template.bind({})
