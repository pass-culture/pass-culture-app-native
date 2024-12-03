import { ComponentStory, ComponentMeta } from '@storybook/react'
import { userEvent, screen } from '@storybook/testing-library'
import React, { Fragment } from 'react'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'

import { SearchInput } from './SearchInput'

const meta: ComponentMeta<typeof SearchInput> = {
  title: 'ui/inputs/SearchInput',
  component: SearchInput,
}
export default meta

export const NotFocusable: ComponentStory<typeof SearchInput> = (args) => (
  <Fragment>
    <SearchInput {...args} />
    <ButtonPrimary wording="This is button should be automatically focused" />
  </Fragment>
)
NotFocusable.args = {
  isFocusable: false,
  placeholder: 'Placeholder...',
}
NotFocusable.play = async () => {
  await screen.findAllByRole('button') // wait first render

  userEvent.tab()
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

const Template: VariantsStory<typeof SearchInput> = (args) => (
  <VariantsTemplate
    variants={variantConfig}
    Component={SearchInput}
    defaultProps={{ placeholder: 'Placeholder...', ...args, label: 'Label' }}
  />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'SearchInput'
