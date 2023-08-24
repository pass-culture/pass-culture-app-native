import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { selectArgTypeFromObject } from 'libs/storybook/selectArgTypeFromObject'
import { theme } from 'theme'
import { BicolorClock } from 'ui/svg/icons/BicolorClock'

import { GenericColoredBanner } from './GenericColoredBanner'

const meta: ComponentMeta<typeof GenericColoredBanner> = {
  title: 'ui/banners/GenericColoredBanner',
  component: GenericColoredBanner,
  argTypes: {
    Icon: selectArgTypeFromObject({
      BicolorClock,
      NoIcon: undefined,
    }),
  },
}
export default meta

const Template: ComponentStory<typeof GenericColoredBanner> = (props) => (
  <GenericColoredBanner {...props} />
)

const message =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.'

export const Default = Template.bind({})
Default.args = {
  message,
}

export const WithIcon = Template.bind({})
WithIcon.args = {
  message,
  Icon: BicolorClock,
}

export const textColor = Template.bind({})
textColor.args = {
  message,
  textColor: theme.colors.error,
}

export const backgroundColor = Template.bind({})
backgroundColor.args = {
  message,
  backgroundColor: theme.colors.attention,
}
