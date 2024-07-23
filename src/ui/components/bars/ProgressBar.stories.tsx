import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { theme } from 'theme'

import { ProgressBar } from './ProgressBar'

const meta: ComponentMeta<typeof ProgressBar> = {
  title: 'ui/progressBars/ProgressBar',
  component: ProgressBar,
}
export default meta

const Template: ComponentStory<typeof ProgressBar> = (props) => <ProgressBar {...props} />

export const Default = Template.bind({})
Default.args = {
  progress: 0.5,
  colors: [theme.colors.primary, theme.colors.secondary],
}

export const Empty = Template.bind({})
Empty.args = {
  progress: 0,
  colors: [theme.colors.greenLight],
}

export const Full = Template.bind({})
Full.args = {
  progress: 1,
  colors: [theme.colors.error],
}
