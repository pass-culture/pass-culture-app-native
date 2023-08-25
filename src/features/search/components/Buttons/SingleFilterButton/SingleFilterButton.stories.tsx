import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { SingleFilterButton } from './SingleFilterButton'

const meta: ComponentMeta<typeof SingleFilterButton> = {
  title: 'Features/search/SingleFilterButton',
  component: SingleFilterButton,
}
export default meta

const Template: ComponentStory<typeof SingleFilterButton> = (props) => (
  <SingleFilterButton {...props} />
)

export const IsSelected = Template.bind({})
IsSelected.args = {
  label: 'CD, vinyles, musique en ligne',
  isSelected: true,
}

export const IsNotSelected = Template.bind({})
IsNotSelected.args = {
  label: 'Catégories',
  isSelected: false,
}
