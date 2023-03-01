import { action } from '@storybook/addon-actions'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { SearchMainInput } from './SearchMainInput'

export default {
  title: 'Features/search/SearchMainInput',
  component: SearchMainInput,
} as ComponentMeta<typeof SearchMainInput>

const Template: ComponentStory<typeof SearchMainInput> = (args) => <SearchMainInput {...args} />

const baseProps = {
  setQuery: action('setQuery'),
  onSubmitQuery: action('onSubmitQuery'),
  resetQuery: action('resetQuery'),

  onFocusState: action('onFocusState'),

  onPressLocationButton: action('onPressLocationButton'),
}

export const Home = Template.bind({})
Home.args = {
  ...baseProps,
  locationLabel: 'Autour de moi',
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
