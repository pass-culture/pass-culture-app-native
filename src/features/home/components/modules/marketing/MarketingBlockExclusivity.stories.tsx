import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { offersFixture } from 'shared/offer/offer.fixture'
import { theme } from 'theme'

import { MarketingBlockExclusivity } from './MarketingBlockExclusivity'

// @ts-ignore import is unresolved
// eslint-disable-next-line import/no-unresolved
import { useQueryDecorator } from '/.storybook/mocks/react-query'

const meta: ComponentMeta<typeof MarketingBlockExclusivity> = {
  title: 'features/home/MarketingBlock/MarketingBlockExclusivity',
  component: MarketingBlockExclusivity,
  decorators: [
    useQueryDecorator,
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
  parameters: {
    useQuery: {
      subcategories: PLACEHOLDER_DATA,
      featureFlags: { get: () => ({ minimalBuildNumber: 1000000 }) },
    },
  },
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
