import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { AgeSeparator } from './AgeSeparator'

const meta: ComponentMeta<typeof AgeSeparator> = {
  title: 'features/tutorial/AgeSeparator',
  component: AgeSeparator,
}
export default meta

const Template: ComponentStory<typeof AgeSeparator> = (props) => <AgeSeparator {...props} />

export const Default = Template.bind({})
Default.args = {
  isEighteen: false,
}

export const IsEighteen = Template.bind({})
IsEighteen.args = {
  isEighteen: true,
}
