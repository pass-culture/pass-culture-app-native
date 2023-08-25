import { ComponentStory, ComponentMeta } from '@storybook/react'
import { userEvent, screen } from '@storybook/testing-library'
import React, { Fragment } from 'react'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'

import { SearchInput } from './SearchInput'

const meta: ComponentMeta<typeof SearchInput> = {
  title: 'ui/inputs/SearchInput',
  component: SearchInput,
}
export default meta

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
