import { action } from '@storybook/addon-actions'
import type { Meta } from '@storybook/react'
import React, { type ComponentProps } from 'react'

import { SystemBanner } from 'ui/components/ModuleBanner/SystemBanner'
import { Variants, VariantsStory, VariantsTemplate } from 'ui/storybook/VariantsTemplate'
import { Everywhere } from 'ui/svg/icons/Everywhere'

const meta: Meta<typeof SystemBanner> = {
  title: 'ui/banners/SystemBanner',
  component: SystemBanner,
}

export default meta

const baseProps: ComponentProps<typeof SystemBanner> = {
  leftIcon: Everywhere,
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

export const Template: VariantsStory<typeof SystemBanner> = {
  name: 'SystemBanner',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={SystemBanner} defaultProps={props} />
  ),
}
