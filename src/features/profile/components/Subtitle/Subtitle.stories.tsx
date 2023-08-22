import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { Subtitle } from './Subtitle'

const meta: ComponentMeta<typeof Subtitle> = {
  title: 'features/profile/Subtitle',
  component: Subtitle,
}
export default meta

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
