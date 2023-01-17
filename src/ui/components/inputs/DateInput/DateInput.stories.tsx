import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { DEFAULT_SELECTED_DATE, MINIMUM_DATE } from 'features/auth/fixtures/fixtures'
import { DateInput } from 'ui/components/inputs/DateInput/DateInput'

export default {
  title: 'ui/inputs/DateInput',
  component: DateInput,
} as ComponentMeta<typeof DateInput>

const Template: ComponentStory<typeof DateInput> = (args) => <DateInput {...args} />

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
