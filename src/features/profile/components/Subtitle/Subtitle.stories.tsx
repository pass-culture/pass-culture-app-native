import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { Subtitle } from './Subtitle'

export default {
  title: 'features/profile/Subtitle',
  component: Subtitle,
} as ComponentMeta<typeof Subtitle>

const Template: ComponentStory<typeof Subtitle> = (props) => <Subtitle {...props} />

export const Default = Template.bind({})
Default.args = {
  startSubtitle: 'Subtitle',
}

export const WithBoldEndSubtitle = Template.bind({})
WithBoldEndSubtitle.args = {
  startSubtitle: 'Subtitle',
  boldEndSubtitle: 'with bold subtitle',
}
