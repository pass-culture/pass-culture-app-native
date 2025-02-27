import { StoryObj, Meta } from '@storybook/react'
import React from 'react'

import { theme } from 'theme'

import { ProgressBar } from './ProgressBar'

const meta: Meta<typeof ProgressBar> = {
  title: 'ui/progressBars/ProgressBar',
  component: ProgressBar,
}
export default meta

const Template: StoryObj<typeof ProgressBar> = (props) => <ProgressBar {...props} />

//TODO(PC-28526): Fix this stories
const Default = Template.bind({})
Default.args = {
  progress: 0.5,
  colors: [theme.colors.primary, theme.colors.secondary],
}

//TODO(PC-28526): Fix this stories
const Empty = Template.bind({})
Empty.args = {
  progress: 0,
  colors: [theme.colors.greenLight],
}

//TODO(PC-28526): Fix this stories
const Full = Template.bind({})
Full.args = {
  progress: 1,
  colors: [theme.colors.error],
}
