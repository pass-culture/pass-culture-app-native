import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { theme } from 'theme'
import { EditPen } from 'ui/svg/icons/EditPen'
import { Email } from 'ui/svg/icons/Email'

import { AnimatedProgressBar } from './AnimatedProgressBar'

const meta: ComponentMeta<typeof AnimatedProgressBar> = {
  title: 'ui/progressBars/AnimatedProgressBar',
  component: AnimatedProgressBar,
}
export default meta

const Template: ComponentStory<typeof AnimatedProgressBar> = (props) => (
  <AnimatedProgressBar {...props} />
)

export const Default = Template.bind({})
Default.args = {
  progress: 0.5,
  color: theme.colors.primary,
  icon: Email,
}

export const Empty = Template.bind({})
Empty.args = {
  progress: 0,
  color: theme.colors.greenLight,
  icon: Email,
}

export const Full = Template.bind({})
Full.args = {
  progress: 1,
  color: theme.colors.error,
  icon: EditPen,
}
