// remove this after rename without old.tsx
// eslint-disable-next-line import/no-extraneous-dependencies
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { action } from 'storybook/actions'

import { SearchMainInput } from './SearchMainInput'

const meta: Meta<typeof SearchMainInput> = {
  title: 'Features/search/SearchMainInput',
  component: SearchMainInput,
}
export default meta

type Story = StoryObj<typeof SearchMainInput>

const baseProps = {
  setQuery: action('setQuery'),
  onSubmitQuery: action('onSubmitQuery'),
  resetQuery: action('resetQuery'),
  onFocusState: action('onFocusState'),
  onPressLocationButton: action('onPressLocationButton'),
  label: 'Label',
}

export const Home: Story = {
  render: (args) => <SearchMainInput {...args} />,
  args: {
    ...baseProps,
  },
}

export const Focus: Story = {
  render: (args) => <SearchMainInput {...args} />,
  args: {
    ...baseProps,
    isFocus: true,
  },
}

export const WithSearch: Story = {
  name: 'SearchMainInput',
  render: (args) => <SearchMainInput {...args} />,
  args: {
    ...baseProps,
    query: 'Naheulbeuk tome 1',
    isFocus: true,
  },
}
