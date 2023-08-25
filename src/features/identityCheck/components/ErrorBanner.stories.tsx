import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { ErrorBanner } from './ErrorBanner'

const meta: ComponentMeta<typeof ErrorBanner> = {
  title: 'ui/banners/ErrorBanner',
  component: ErrorBanner,
}
export default meta

const Template: ComponentStory<typeof ErrorBanner> = (props) => <ErrorBanner {...props} />

const message =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.'

export const Default = Template.bind({})
Default.args = {
  message,
}
