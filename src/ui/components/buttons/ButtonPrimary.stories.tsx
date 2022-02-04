import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { ButtonPrimary } from './ButtonPrimary'

export default {
  title: 'ui/buttons/ButtonPrimary',
  component: ButtonPrimary,
} as ComponentMeta<typeof ButtonPrimary>

const Template: ComponentStory<typeof ButtonPrimary> = (args) => <ButtonPrimary {...args} />

export const Default = Template.bind({})
Default.args = {
  wording: 'Confirmer',
}

export const Loading = Template.bind({})
Loading.args = {
  wording: 'Confirmer',
  isLoading: true,
}

export const Tall = Template.bind({})
Tall.args = {
  wording: 'Confirmer',
  buttonHeight: 'tall',
}
