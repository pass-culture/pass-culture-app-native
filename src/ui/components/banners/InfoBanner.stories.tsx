import { action } from '@storybook/addon-actions'
import type { Meta } from '@storybook/react'
import React from 'react'

import { ButtonQuaternarySecondary } from 'ui/components/buttons/ButtonQuaternarySecondary'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { BicolorClock } from 'ui/svg/icons/BicolorClock'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'

import { InfoBanner } from './InfoBanner'

const meta: Meta<typeof InfoBanner> = {
  title: 'ui/banners/InfoBanner',
  component: InfoBanner,
}
export default meta

const message =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.'

const ActionButton = (
  <ButtonQuaternarySecondary
    numberOfLines={2}
    justifyContent="flex-start"
    onPress={action('Press\u00a0!')}
    icon={PlainArrowNext}
    wording="Call to action message"
  />
)

const variantConfig: Variants<typeof InfoBanner> = [
  {
    label: 'InfoBanner default',
    props: { message },
  },
  {
    label: 'InfoBanner with icon',
    props: { message, icon: BicolorClock },
  },
  {
    label: 'InfoBanner with children',
    props: { message, children: ActionButton },
  },
  {
    label: 'InfoBanner with color message',
    props: { message, withLightColorMessage: true },
  },
]

const Template: VariantsStory<typeof InfoBanner> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={InfoBanner} defaultProps={args} />
)

export const AllVariants = Template.bind({})
