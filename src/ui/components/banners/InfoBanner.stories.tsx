import type { Meta } from '@storybook/react-vite'
import React from 'react'
import { action } from 'storybook/actions'

import { ButtonQuaternarySecondary } from 'ui/components/buttons/ButtonQuaternarySecondary'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { Clock } from 'ui/svg/icons/Clock'
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
    props: { message, icon: Clock },
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

export const Template: VariantsStory<typeof InfoBanner> = {
  name: 'InfoBanner',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={InfoBanner} defaultProps={props} />
  ),
}
