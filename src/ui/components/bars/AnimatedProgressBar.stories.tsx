import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { EditPen } from 'ui/svg/icons/EditPen'
import { Email } from 'ui/svg/icons/Email'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

import { AnimatedProgressBar } from './AnimatedProgressBar'

export default {
  title: 'ui/AnimatedProgressBar',
  component: AnimatedProgressBar,
} as ComponentMeta<typeof AnimatedProgressBar>

const Template: ComponentStory<typeof AnimatedProgressBar> = (props) => (
  <AnimatedProgressBar {...props} />
)

export const Default = Template.bind({})
Default.args = {
  progress: 0.5,
  color: ColorsEnum.PRIMARY,
  icon: Email,
}

export const Empty = Template.bind({})
Empty.args = {
  progress: 0,
  color: ColorsEnum.GREEN_LIGHT,
  icon: Email,
}

export const Full = Template.bind({})
Full.args = {
  progress: 1,
  color: ColorsEnum.ERROR,
  icon: EditPen,
}
