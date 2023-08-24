import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { theme } from 'theme'
import { Bag } from 'ui/svg/icons/bicolor/Bag'

import { VenueTypeLocationIcon } from './VenueTypeLocationIcon'

const meta: ComponentMeta<typeof VenueTypeLocationIcon> = {
  title: 'Features/Home/VenueTypeLocationIcon',
  component: VenueTypeLocationIcon,
}
export default meta

const Template: ComponentStory<typeof VenueTypeLocationIcon> = (props) => (
  <VenueTypeLocationIcon {...props} />
)

export const WithColor = Template.bind({})
WithColor.args = {
  VenueTypeIcon: Bag,
  iconColor: theme.colors.greySemiDark,
  backgroundColor: theme.colors.greyLight,
}

export const WithoutColor = Template.bind({})
WithoutColor.args = {
  VenueTypeIcon: Bag,
}
