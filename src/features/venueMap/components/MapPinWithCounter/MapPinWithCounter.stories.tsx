import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { MapPinWithCounter } from 'features/venueMap/components/MapPinWithCounter/MapPinWithCounter'

const meta: Meta<typeof MapPinWithCounter> = {
  title: 'features/search/MapPinWithCounter',
  component: MapPinWithCounter,
}
export default meta

const Template: StoryObj<typeof MapPinWithCounter> = (props) => (
  <MapPinWithCounter {...props} />
)

export const Default = Template.bind({})
Default.args = {
  count: 100,
}
