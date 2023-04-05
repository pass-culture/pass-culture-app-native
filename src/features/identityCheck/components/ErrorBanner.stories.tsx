import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { selectArgTypeFromObject } from 'libs/storybook/selectArgTypeFromObject'
import { BicolorClock } from 'ui/svg/icons/BicolorClock'

import { ErrorBanner } from './ErrorBanner'

export default {
  title: 'ui/banners/ErrorBanner',
  component: ErrorBanner,
  argTypes: {
    icon: selectArgTypeFromObject({
      BicolorClock,
      NoIcon: undefined,
    }),
  },
} as ComponentMeta<typeof ErrorBanner>

const Template: ComponentStory<typeof ErrorBanner> = (props) => <ErrorBanner {...props} />

const message =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.'

export const Default = Template.bind({})
Default.args = {
  message,
}
