import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { LocationWidget } from './LocationWidget'

export default {
  title: 'Features/Location/LocationWidget',
  component: LocationWidget,
} as ComponentMeta<typeof LocationWidget>

const Template: ComponentStory<typeof LocationWidget> = () => <LocationWidget />

export const Default = Template.bind({})
