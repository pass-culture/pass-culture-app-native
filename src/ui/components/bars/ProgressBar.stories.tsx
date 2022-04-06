import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

import { ProgressBar } from './ProgressBar'

export default {
  title: 'ui/progressBars/ProgressBar',
  component: ProgressBar,
} as ComponentMeta<typeof ProgressBar>

const Template: ComponentStory<typeof ProgressBar> = (props) => <ProgressBar {...props} />

export const Default = Template.bind({})
Default.args = {
  progress: 0.5,
  colors: [ColorsEnum.PRIMARY, ColorsEnum.SECONDARY],
}

export const Empty = Template.bind({})
Empty.args = {
  progress: 0,
  colors: [ColorsEnum.GREEN_LIGHT],
}

export const Full = Template.bind({})
Full.args = {
  progress: 1,
  colors: [ColorsEnum.ERROR],
}
