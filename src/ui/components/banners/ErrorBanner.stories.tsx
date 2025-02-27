import { StoryObj, Meta } from '@storybook/react'
import React from 'react'

import { ErrorBanner } from './ErrorBanner'

const meta: Meta<typeof ErrorBanner> = {
  title: 'ui/banners/ErrorBanner',
  component: ErrorBanner,
}
export default meta

const Template: StoryObj<typeof ErrorBanner> = (props) => <ErrorBanner {...props} />

export const Default = Template.bind({})
Default.args = {
  message:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
}
Default.storyName = 'ErrorBanner'
