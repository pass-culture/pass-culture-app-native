import { action } from '@storybook/addon-actions'
import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { theme } from 'theme'
import { SystemBanner } from 'ui/components/ModuleBanner/SystemBanner'
import { BicolorEverywhere as Everywhere } from 'ui/svg/icons/BicolorEverywhere'

const meta: Meta<typeof SystemBanner> = {
  title: 'ui/banners/SystemBanner',
  component: SystemBanner,
}
export default meta

type Story = StoryObj<typeof SystemBanner>

export const Default: Story = {
  name: 'SystemBanner',
  args: {
    LeftIcon: <Everywhere color={theme.colors.secondaryLight200} />,
    title: 'Géolocalise-toi',
    subtitle: 'Pour trouver des offres autour de toi.',
    onPress: action('pressed!'),
    accessibilityLabel: 'Active ta géolocalisation',
    analyticsParams: { type: 'location', from: 'home' },
  },
  render: (args) => <SystemBanner {...args} />,
}
