import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta } from '@storybook/react'
import React from 'react'

import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { offersFixture } from 'shared/offer/offer.fixture'
import { theme } from 'theme'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

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

const variantConfig: Variants<typeof MarketingBlockExclusivity> = [
  {
    label: 'MarketingBlockExclusivity default',
    props: {
      title: 'Marathon Harry Potter dans tous les cinémas de France',
      subtitle: 'Du 12/06 au 24/06',
      homeId: 'homeId',
      moduleId: 'moduleId',
      backgroundImageUrl:
        'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW',
      offer: offersFixture[0],
    },
  },
  {
    label: 'MarketingBlockExclusivity without image',
    props: {
      title: 'Marathon Harry Potter dans tous les cinémas de France',
      subtitle: 'Du 12/06 au 24/06',
      homeId: 'homeId',
      moduleId: 'moduleId',
      offer: offersFixture[0],
    },
  },
]

const Template: VariantsStory<typeof MarketingBlockExclusivity> = () => (
  <VariantsTemplate variants={variantConfig} Component={MarketingBlockExclusivity} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'MarketingBlockExclusivity'
AllVariants.parameters = {
  chromatic: { viewports: [theme.breakpoints.xs, theme.breakpoints.xl] },
}
