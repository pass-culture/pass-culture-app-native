import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { Bookstore } from 'ui/svg/icons/bicolor/Bookstore'

import { CategoryButton } from './CategoryButton'

export default {
  title: 'Features/search/CategoryButton',
  component: CategoryButton,
} as ComponentMeta<typeof CategoryButton>

const Template: ComponentStory<typeof CategoryButton> = (props) => <CategoryButton {...props} />

export const WithColor = Template.bind({})
WithColor.args = {
  label: 'Bibliothèques & Médiathèques',
  Icon: Bookstore,
  color: '#870087',
}

export const WithoutColor = Template.bind({})
WithoutColor.args = {
  label: 'Bibliothèques & Médiathèques',
  Icon: Bookstore,
}
