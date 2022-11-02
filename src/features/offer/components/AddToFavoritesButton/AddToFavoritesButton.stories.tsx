import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { AddToFavoritesButton } from './AddToFavoritesButton'

export default {
  title: 'Features/Offer/AddToFavoritesButton',
  component: AddToFavoritesButton,
} as ComponentMeta<typeof AddToFavoritesButton>

const Template: ComponentStory<typeof AddToFavoritesButton> = (props) => (
  <AddToFavoritesButton {...props} />
)
export const Default = Template.bind({})
