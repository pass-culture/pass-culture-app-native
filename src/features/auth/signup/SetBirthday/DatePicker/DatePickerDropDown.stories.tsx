import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import {
  DEFAULT_SELECTED_DATE,
  MINIMUM_DATE,
} from 'features/auth/signup/SetBirthday/utils/fixtures'

import { DatePickerDropDown } from './DatePickerDropDown.web'

export default {
  title: 'ui/input/DatePicker/DatePickerDropDown',
  component: DatePickerDropDown,
} as ComponentMeta<typeof DatePickerDropDown>

const Template: ComponentStory<typeof DatePickerDropDown> = (args) => (
  <DatePickerDropDown {...args} />
)

export const Default = Template.bind({})
Default.args = {
  defaultSelectedDate: DEFAULT_SELECTED_DATE,
  minimumDate: MINIMUM_DATE,
}

export const Error = Template.bind({})
Error.args = {
  defaultSelectedDate: DEFAULT_SELECTED_DATE,
  minimumDate: MINIMUM_DATE,
  errorMessage: 'Error message',
}
