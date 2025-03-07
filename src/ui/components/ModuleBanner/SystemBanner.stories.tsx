import { action } from '@storybook/addon-actions'
import { ComponentMeta } from '@storybook/react'
import React, { ComponentProps } from 'react'

import { SystemBanner } from 'ui/components/ModuleBanner/SystemBanner'
import { Variants, VariantsStory, VariantsTemplate } from 'ui/storybook/VariantsTemplate'
import { BicolorEverywhere } from 'ui/svg/icons/BicolorEverywhere'

export default {
  title: 'ui/banners/SystemBanner',
  component: SystemBanner,
} as ComponentMeta<typeof SystemBanner>

const baseProps: ComponentProps<typeof SystemBanner> = {
  leftIcon: BicolorEverywhere,
  title: 'Géolocalise-toi',
  subtitle: 'Pour trouver des offres autour de toi.',
  onPress: action('pressed!'),
  accessibilityLabel: 'Active ta géolocalisation',
  analyticsParams: { type: 'location', from: 'home' },
}

const variantConfig: Variants<typeof SystemBanner> = [
  {
    label: 'SystemBanner default',
    props: {
      withBackground: false,
      ...baseProps,
    },
  },
  {
    label: 'SystemBanner with background',
    props: {
      withBackground: true,
      ...baseProps,
    },
  },
]

const Template: VariantsStory<typeof SystemBanner> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={SystemBanner} defaultProps={args} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'SystemBanner'
