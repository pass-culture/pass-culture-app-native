import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { offersFixture } from 'shared/offer/offer.fixture'
import { theme } from 'theme'

import { MarketingBlockExclusivity } from './MarketingBlockExclusivity'

const meta: ComponentMeta<typeof MarketingBlockExclusivity> = {
  title: 'features/home/MarketingBlock/MarketingBlockExclusivity',
  component: MarketingBlockExclusivity,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const Template: ComponentStory<typeof MarketingBlockExclusivity> = (props) => (
  <MarketingBlockExclusivity {...props} />
)

export const Default = Template.bind({})
Default.args = {
  moduleId: '1',
  backgroundImageUrl:
    'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW',
  offer: offersFixture[0],
}

Default.parameters = {
  chromatic: { viewports: [theme.breakpoints.xs, theme.breakpoints.xl] },
}

export const WithoutBackgroundImage = Template.bind({})
WithoutBackgroundImage.args = {
  moduleId: '1',
  offer: offersFixture[0],
}

WithoutBackgroundImage.parameters = {
  chromatic: { viewports: [theme.breakpoints.xs, theme.breakpoints.xl] },
}
