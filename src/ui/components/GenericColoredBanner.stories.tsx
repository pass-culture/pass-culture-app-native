import { action } from '@storybook/addon-actions'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { selectArgTypeFromObject } from 'libs/storybook/selectArgTypeFromObject'
import { theme } from 'theme'
import { ButtonQuaternarySecondary } from 'ui/components/buttons/ButtonQuarternarySecondary'
import { BicolorClock } from 'ui/svg/icons/BicolorClock'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'

import { GenericColoredBanner } from './GenericColoredBanner'

export default {
  title: 'ui/banners/GenericColoredBanner',
  component: GenericColoredBanner,
  argTypes: {
    icon: selectArgTypeFromObject({
      BicolorClock,
      NoIcon: undefined,
    }),
  },
} as ComponentMeta<typeof GenericColoredBanner>

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

export const textColor = Template.bind({})
textColor.args = {
  message,
  textColor: theme.colors.greyDark,
  children: ActionButton,
}
export const backgroundColor = Template.bind({})
backgroundColor.args = {
  message,
  backgroundColor: theme.colors.secondaryLight,
  textColor: theme.colors.greyDark,

  children: ActionButton,
}
