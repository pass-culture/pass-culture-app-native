import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { monthNames } from 'features/bookOffer/components/Calendar/Calendar.utils'

import { DropDown } from './DropDown.web'

export default {
  title: 'ui/input/DropDown',
  component: DropDown,
} as ComponentMeta<typeof DropDown>

const Template: ComponentStory<typeof DropDown> = (args) => <DropDown {...args} />

export const Default = Template.bind({})
Default.args = {
  label: 'Mois',
  placeholder: 'MM',
  options: monthNames,
}

export const Error = Template.bind({})
Error.args = {
  label: 'Mois',
  placeholder: 'MM',
  options: monthNames,
  isError: true,
}
