import { action } from '@storybook/addon-actions'
import { StoryObj, Meta } from '@storybook/react'
import React from 'react'

import { SearchMainInput } from './SearchMainInput'

const meta: Meta<typeof SearchMainInput> = {
  title: 'Features/search/SearchMainInput',
  component: SearchMainInput,
}
export default meta

const Template: StoryObj<typeof SearchMainInput> = (args) => <SearchMainInput {...args} />

const baseProps = {
  setQuery: action('setQuery'),
  onSubmitQuery: action('onSubmitQuery'),
  resetQuery: action('resetQuery'),
  onFocusState: action('onFocusState'),
  onPressLocationButton: action('onPressLocationButton'),
  label: 'Label',
}

export const Home = Template.bind({})
Home.args = {
  ...baseProps,
  showLocationButton: true,
}

export const Focus = Template.bind({})
Focus.args = {
  ...baseProps,
  isFocus: true,
}

export const WithSearch = Template.bind({})
WithSearch.args = {
  ...baseProps,
  query: 'Naheulbeuk tome 1',
  isFocus: true,
}
