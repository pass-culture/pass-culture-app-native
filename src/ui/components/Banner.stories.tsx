import { action } from '@storybook/addon-actions'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { selectArgTypeFromObject } from 'libs/storybook/selectArgTypeFromObject'
import { ButtonQuaternarySecondary } from 'ui/components/buttons/ButtonQuarternarySecondary'
import { BicolorClock } from 'ui/svg/icons/BicolorClock'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'

import { Banner } from './Banner'

export default {
  title: 'ui/banners/Banner',
  component: Banner,
  argTypes: {
    icon: selectArgTypeFromObject({
      BicolorClock,
      NoIcon: undefined,
    }),
  },
} as ComponentMeta<typeof Banner>

const Template: ComponentStory<typeof Banner> = (props) => <Banner {...props} />

const message =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.'

export const Default = Template.bind({})
Default.args = {
  message,
}

export const WithIcon = Template.bind({})
WithIcon.args = {
  message,
  icon: BicolorClock,
}

const ActionButton = () => (
  <ButtonQuaternarySecondary
    numberOfLines={2}
    justifyContent="flex-start"
    onPress={action('Press\u00a0!')}
    icon={PlainArrowNext}
    wording="Call to action message"
  />
)

export const WithChildren = Template.bind({})
WithChildren.args = {
  message,
  children: ActionButton,
}

export const WithLightColorMessage = Template.bind({})
WithLightColorMessage.args = {
  message,
  withLightColorMessage: true,
  children: ActionButton,
}
