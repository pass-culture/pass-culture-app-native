import { ComponentStory } from '@storybook/react'
import React from 'react'

import { DistanceTag } from './DistanceTag'

export default {
  title: 'features/offer/DistanceTag',
  component: DistanceTag,
}

const Template: ComponentStory<typeof DistanceTag> = (props) => <DistanceTag {...props} />

export const Default = Template.bind({})
Default.args = {
  distance: '1,4km',
}
