import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import {
  DEFAULT_SELECTED_DATE,
  MINIMUM_DATE,
} from 'features/auth/signup/SetBirthday/utils/fixtures'

import { DatePickerSpinner } from './DatePickerSpinner.web'

export default {
  title: 'ui/input/DatePicker/DatePickerSpinner',
  component: DatePickerSpinner,
} as ComponentMeta<typeof DatePickerSpinner>

const Template: ComponentStory<typeof DatePickerSpinner> = (args) => <DatePickerSpinner {...args} />

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
