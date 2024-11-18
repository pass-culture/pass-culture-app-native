import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { theme } from 'theme'
import { SystemBanner } from 'ui/components/ModuleBanner/SystemBanner'
import { BicolorEverywhere as Everywhere } from 'ui/svg/icons/BicolorEverywhere'

export default {
  title: 'ui/banners/SystemBanner',
  component: SystemBanner,
} as ComponentMeta<typeof SystemBanner>

const Template: ComponentStory<typeof SystemBanner> = (props) => <SystemBanner {...props} />

export const Default = Template.bind({})
Default.args = {
  LeftIcon: <Everywhere color={theme.colors.secondaryLight200} />,
  title: 'Géolocalise-toi',
  subtitle: 'Pour trouver des offres autour de toi.',
  onPress: action('pressed!'),
  accessibilityLabel: 'Active ta géolocalisation',
  analyticsParams: { type: 'location', from: 'home' },
}
Default.storyName = 'SystemBanner'
