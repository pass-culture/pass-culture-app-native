import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { SystemBanner } from 'ui/components/ModuleBanner/SystemBanner'
import { BicolorEverywhere as Everywhere } from 'ui/svg/icons/BicolorEverywhere'

export default {
  title: 'ui/banners/SystemBanner',
  component: SystemBanner,
} as ComponentMeta<typeof SystemBanner>

const Template: ComponentStory<typeof SystemBanner> = (props) => <SystemBanner {...props} />

const StyledEverywhere = styled(Everywhere).attrs(({ theme }) => ({
  color: theme.colors.secondaryLight200,
}))``

export const Default = Template.bind({})
Default.args = {
  LeftIcon: <StyledEverywhere />,
  title: 'Géolocalise-toi',
  subtitle: 'Pour trouver des offres autour de toi.',
  onPress: action('pressed!'),
  accessibilityLabel: 'Active ta géolocalisation',
}
