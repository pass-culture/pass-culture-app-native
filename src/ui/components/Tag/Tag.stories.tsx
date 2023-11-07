import { ComponentStory } from '@storybook/react'
import React from 'react'

import { Tag } from './Tag'

export default {
  title: 'ui/Tag',
  component: Tag,
}

const Template: ComponentStory<typeof Tag> = (props) => <Tag {...props} />

export const Default = Template.bind({})
Default.args = {
  label: '1,4km',
}
