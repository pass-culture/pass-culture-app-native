import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { AlertBanner } from './AlertBanner'

const meta: ComponentMeta<typeof AlertBanner> = {
  title: 'ui/banners/AlertBanner',
  component: AlertBanner,
}
export default meta

const Template: ComponentStory<typeof AlertBanner> = (props) => <AlertBanner {...props} />

const message =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.'

export const Default = Template.bind({})
Default.args = {
  message,
}
