import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { theme } from 'theme'
import { Check } from 'ui/svg/icons/Check'

import { SingleFilterButton } from './SingleFilterButton'

export default {
  title: 'Features/Search/SingleFilterButton',
  component: SingleFilterButton,
} as ComponentMeta<typeof SingleFilterButton>

const Template: ComponentStory<typeof SingleFilterButton> = (props) => (
  <SingleFilterButton {...props} />
)

export const WithColor = Template.bind({})
WithColor.args = {
  label: 'CD, vinyles, musique en ligne',
  Icon: Check,
  color: theme.colors.primary,
}

export const WithoutColor = Template.bind({})
WithoutColor.args = {
  label: 'Catégories',
}
