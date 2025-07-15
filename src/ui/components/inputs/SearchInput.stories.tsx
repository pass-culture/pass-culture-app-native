import type { Meta, StoryObj } from '@storybook/react-vite'
import { userEvent, screen } from '@storybook/testing-library'
import React, { Fragment } from 'react'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'

import { SearchInput } from './SearchInput'

const meta: Meta<typeof SearchInput> = {
  title: 'ui/inputs/SearchInput',
  component: SearchInput,
}
export default meta

type Story = StoryObj<typeof SearchInput>

export const NotFocusable: Story = {
  render: (args) => (
    <Fragment>
      <SearchInput {...args} />
      <ButtonPrimary wording="This is button should be automatically focused" />
    </Fragment>
  ),
  args: {
    isFocusable: false,
    placeholder: 'Placeholder...',
  },
  play: async () => {
    await screen.findAllByRole('button') // wait first render
    userEvent.tab()
  },
}

const variantConfig: Variants<typeof SearchInput> = [
  {
    label: 'SearchInput',
    props: { placeholder: 'Placeholder...' },
  },
  {
    label: 'Disabled SearchInput',
    props: { disabled: true },
  },
  {
    label: 'SearchInput WithTallHeight',
    props: { inputHeight: 'tall' },
  },
  {
    label: 'SearchInput with LeftIcon',
    props: { LeftIcon: () => <MagnifyingGlass /> },
  },
  {
    label: 'SearchInput with value',
    props: { value: 'Value' },
  },
]

export const Template: VariantsStory<typeof SearchInput> = {
  name: 'SearchInput',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={SearchInput}
      defaultProps={{ placeholder: 'Placeholder...', ...props, label: 'Label' }}
    />
  ),
}
