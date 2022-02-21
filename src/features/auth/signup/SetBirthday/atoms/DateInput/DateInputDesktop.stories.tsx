import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import {
  DEFAULT_SELECTED_DATE,
  MINIMUM_DATE,
} from 'features/auth/signup/SetBirthday/utils/fixtures'

import { DateInputDesktop } from './DateInputDesktop.web'

export default {
  title: 'ui/input/DateInputDesktop',
  component: DateInputDesktop,
} as ComponentMeta<typeof DateInputDesktop>

const Template: ComponentStory<typeof DateInputDesktop> = (args) => <DateInputDesktop {...args} />

export const Default = Template.bind({})
Default.args = {
  defaultSelectedDate: DEFAULT_SELECTED_DATE,
  minimumDate: MINIMUM_DATE,
}

export const Error = Template.bind({})
Error.args = {
  defaultSelectedDate: DEFAULT_SELECTED_DATE,
  minimumDate: MINIMUM_DATE,
  errorMessage: 'Too young',
}
