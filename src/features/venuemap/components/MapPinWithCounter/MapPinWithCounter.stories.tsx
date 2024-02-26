import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { MApPinWithCounter } from 'features/venuemap/components/MapPinWithCounter/MapPinWithCounter'

const meta: ComponentMeta<typeof MApPinWithCounter> = {
  title: 'features/search/MApPinWithCounter',
  component: MApPinWithCounter,
}
export default meta

const Template: ComponentStory<typeof MApPinWithCounter> = (props) => (
  <MApPinWithCounter {...props} />
)

export const Default = Template.bind({})

export const Clustered = Template.bind({})
Clustered.args = {
  count: 100,
}
