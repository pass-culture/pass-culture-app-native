import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { ClippedTag } from './ClippedTag'

export default {
  title: 'ui/tags/ClippedTag',
  component: ClippedTag,
} as ComponentMeta<typeof ClippedTag>

const Template: ComponentStory<typeof ClippedTag> = (props) => <ClippedTag {...props} />

export const Default = Template.bind({})
Default.args = {
  label: 'Musée du Louvre',
}
