import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { DEFAULT_SELECTED_DATE, MAXIMUM_DATE, MINIMUM_DATE } from 'features/auth/fixtures/fixtures'
import { DateInput } from 'ui/components/inputs/DateInput/DateInput'

const meta: ComponentMeta<typeof DateInput> = {
  title: 'ui/inputs/DateInput',
  component: DateInput,
}
export default meta

const Template: ComponentStory<typeof DateInput> = (args) => <DateInput {...args} />

export const Default = Template.bind({})
Default.args = {
  defaultSelectedDate: DEFAULT_SELECTED_DATE,
  minimumDate: MINIMUM_DATE,
  maximumDate: MAXIMUM_DATE,
}

export const Error = Template.bind({})
Error.args = {
  date: DEFAULT_SELECTED_DATE,
  defaultSelectedDate: DEFAULT_SELECTED_DATE,
  minimumDate: MINIMUM_DATE,
  maximumDate: MAXIMUM_DATE,
  errorMessage: 'Error message',
}
