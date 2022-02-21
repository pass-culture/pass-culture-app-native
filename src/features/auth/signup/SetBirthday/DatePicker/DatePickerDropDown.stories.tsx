import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { MINIMUM_YEAR } from 'features/auth/signup/SetBirthday/utils/constants'

import { DatePickerDropDown } from './DatePickerDropDown.web'

const DEFAULT_SELECTED_DATE = new Date('2006-06-01T00:00:00.000Z')

export default {
  title: 'ui/input/DatePicker/DatePickerDropDown',
  component: DatePickerDropDown,
} as ComponentMeta<typeof DatePickerDropDown>

const Template: ComponentStory<typeof DatePickerDropDown> = (args) => (
  <DatePickerDropDown {...args} />
)

export const Default = Template.bind({})
Default.args = { defaultSelectedDate: DEFAULT_SELECTED_DATE, minimumYear: MINIMUM_YEAR }
