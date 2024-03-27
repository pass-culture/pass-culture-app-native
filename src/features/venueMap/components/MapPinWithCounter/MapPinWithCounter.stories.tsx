import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { MapPinWithCounter } from 'features/venueMap/components/MapPinWithCounter/MapPinWithCounter'

const meta: ComponentMeta<typeof MapPinWithCounter> = {
  title: 'features/search/MapPinWithCounter',
  component: MapPinWithCounter,
}
export default meta

const Template: ComponentStory<typeof MapPinWithCounter> = (props) => (
  <MapPinWithCounter {...props} />
)

export const Default = Template.bind({})
Default.args = {
  count: 100,
}
