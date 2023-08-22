import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { ClippedTag } from './ClippedTag'

const meta: ComponentMeta<typeof ClippedTag> = {
  title: 'ui/tags/ClippedTag',
  component: ClippedTag,
}
export default meta

const Template: ComponentStory<typeof ClippedTag> = (props) => <ClippedTag {...props} />

export const Default = Template.bind({})
Default.args = {
  label: 'Musée du Louvre',
}
