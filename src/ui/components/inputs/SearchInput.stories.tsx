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
  onPressLocationButton: undefined,
}

export const Disabled = Template.bind({})
Disabled.args = {
  placeholder: 'Placeholder...',
  disabled: true,
  onPressLocationButton: undefined,
}

export const WithTallHeight = Template.bind({})
WithTallHeight.args = {
  placeholder: 'Placeholder...',
  inputHeight: 'tall',
  onPressLocationButton: undefined,
}

export const WithLeftIcon = Template.bind({})
WithLeftIcon.args = {
  placeholder: 'Placeholder...',
  LeftIcon: () => <MagnifyingGlass />,
  onPressLocationButton: undefined,
}

export const WithLabel = Template.bind({})
WithLabel.args = {
  placeholder: 'Placeholder...',
  label: 'Label',
  onPressLocationButton: undefined,
}

export const WithValue = Template.bind({})
WithValue.args = {
  placeholder: 'Placeholder...',
  value: 'Value',
  onPressLocationButton: undefined,
}

export const WithLocationButton = Template.bind({})
WithLocationButton.args = {
  placeholder: 'Placeholder...',
  value: '',
  locationLabel: 'Autour de moi',
  inputHeight: 'regular',
}
