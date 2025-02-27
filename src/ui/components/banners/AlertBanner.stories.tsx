import { StoryObj, Meta } from '@storybook/react'
import React from 'react'

import { AlertBanner } from './AlertBanner'

const meta: Meta<typeof AlertBanner> = {
  title: 'ui/banners/AlertBanner',
  component: AlertBanner,
}
export default meta

const Template: StoryObj<typeof AlertBanner> = (props) => <AlertBanner {...props} />

export const Default = Template.bind({})
Default.args = {
  message:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
}
Default.storyName = 'AlertBanner'
