import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { VenueMapPin } from 'features/search/components/VenueMapPin/VenueMapPin'

const meta: ComponentMeta<typeof VenueMapPin> = {
  title: 'features/search/VenueMapPin',
  component: VenueMapPin,
}
export default meta

const Template: ComponentStory<typeof VenueMapPin> = (props) => <VenueMapPin {...props} />

export const Default = Template.bind({})

export const Clustered = Template.bind({})
Clustered.args = {
  count: 100,
}
