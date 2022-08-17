import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { Check } from 'ui/svg/icons/Check'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

import { SearchFilterButton } from './SearchFilterButton'

export default {
  title: 'Features/Search/SearchFilterButton',
  component: SearchFilterButton,
} as ComponentMeta<typeof SearchFilterButton>

const Template: ComponentStory<typeof SearchFilterButton> = (props) => (
  <SearchFilterButton {...props} />
)

export const WithColor = Template.bind({})
WithColor.args = {
  label: 'CD, vinyles, musique en ligne',
  Icon: Check,
  color: ColorsEnum.PRIMARY,
}

export const WithoutColor = Template.bind({})
WithoutColor.args = {
  label: 'Catégories',
}
