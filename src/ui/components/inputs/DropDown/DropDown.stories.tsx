import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { monthNames } from 'shared/date/months'
import { DropDown } from 'ui/components/inputs/DropDown/DropDown'

const meta: ComponentMeta<typeof DropDown> = {
  title: 'ui/inputs/DropDown',
  component: DropDown,
}
export default meta

const Template: ComponentStory<typeof DropDown> = (args) => <DropDown {...args} />

export const Default = Template.bind({})
Default.args = {
  label: 'Mois',
  placeholder: 'Mois',
  options: monthNames,
}

export const Error = Template.bind({})
Error.args = {
  label: 'Mois',
  placeholder: 'Mois',
  options: monthNames,
  isError: true,
}

export const WithDefaultSelectedValue = Template.bind({})
WithDefaultSelectedValue.args = {
  label: 'Mois',
  placeholder: 'Mois',
  options: monthNames,
  value: monthNames[7],
}
