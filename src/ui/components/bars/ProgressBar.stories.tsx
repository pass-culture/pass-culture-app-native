import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { EditPen } from 'ui/svg/icons/EditPen'
import { Email } from 'ui/svg/icons/Email'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

import { ProgressBar } from './ProgressBar'

export default {
  title: 'ui/ProgressBar',
  component: ProgressBar,
} as ComponentMeta<typeof ProgressBar>

const Template: ComponentStory<typeof ProgressBar> = (props) => <ProgressBar {...props} />

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
