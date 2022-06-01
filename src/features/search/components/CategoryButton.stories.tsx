import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { Bookstore } from 'ui/svg/icons/bicolor/Bookstore'

import { CategoryButton } from './CategoryButton'

export default {
  title: 'ui/CategoryButton',
  component: CategoryButton,
} as ComponentMeta<typeof CategoryButton>

const Template: ComponentStory<typeof CategoryButton> = (props) => <CategoryButton {...props} />

export const Libraries = Template.bind({})
Libraries.args = {
  label: 'Bibliothèques & Médiathèques',
  Icon: Bookstore,
  borderLeftColor: '#870087',
  style: { width: 220 },
}
