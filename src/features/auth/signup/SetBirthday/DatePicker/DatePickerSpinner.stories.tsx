import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { MINIMUM_YEAR } from 'features/auth/signup/SetBirthday/utils/constants'

import { DatePickerSpinner } from './DatePickerSpinner.web'

const DEFAULT_SELECTED_DATE = new Date('2006-06-01T00:00:00.000Z')

export default {
  title: 'ui/input/DatePicker/DatePickerSpinner',
  component: DatePickerSpinner,
} as ComponentMeta<typeof DatePickerSpinner>

const Template: ComponentStory<typeof DatePickerSpinner> = (args) => <DatePickerSpinner {...args} />

export const Default = Template.bind({})
Default.args = { defaultSelectedDate: DEFAULT_SELECTED_DATE, minimumYear: MINIMUM_YEAR }
