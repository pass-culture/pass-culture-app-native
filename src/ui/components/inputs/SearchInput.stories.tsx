import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'

import { SearchInput } from './SearchInput'

export default {
  title: 'ui/inputs/SearchInput',
  component: SearchInput,
} as ComponentMeta<typeof SearchInput>

const Template: ComponentStory<typeof SearchInput> = (args) => <SearchInput {...args} />

export const Default = Template.bind({})
Default.args = {
  placeholder: 'Placeholder...',
}

export const Disabled = Template.bind({})
Disabled.args = {
  placeholder: 'Placeholder...',
  disabled: true,
}

export const WithTallHeight = Template.bind({})
WithTallHeight.args = {
  placeholder: 'Placeholder...',
  inputHeight: 'tall',
}

export const WithLeftIcon = Template.bind({})
WithLeftIcon.args = {
  placeholder: 'Placeholder...',
  LeftIcon: () => <MagnifyingGlass />,
}

export const WithLabel = Template.bind({})
WithLabel.args = {
  placeholder: 'Placeholder...',
  label: 'Label',
}

export const WithValue = Template.bind({})
WithValue.args = {
  placeholder: 'Placeholder...',
  value: 'Value',
}
