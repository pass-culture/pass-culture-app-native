import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { AgeSeparator } from './AgeSeparator'

export default {
  title: 'features/onboarding/AgeSeparator',
  component: AgeSeparator,
} as ComponentMeta<typeof AgeSeparator>

const Template: ComponentStory<typeof AgeSeparator> = (props) => <AgeSeparator {...props} />

export const Default = Template.bind({})
Default.args = {
  isEighteen: false,
}

export const IsEighteen = Template.bind({})
IsEighteen.args = {
  isEighteen: true,
}
