import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { DateInputDesktop } from './DateInputDesktop.web'

export default {
  title: 'ui/input/DateInputDesktop',
  component: DateInputDesktop,
} as ComponentMeta<typeof DateInputDesktop>

const Template: ComponentStory<typeof DateInputDesktop> = (args) => <DateInputDesktop {...args} />

export const Default = Template.bind({})
