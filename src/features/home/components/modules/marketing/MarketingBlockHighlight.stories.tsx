import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta } from '@storybook/react'
import React from 'react'

import { theme } from 'theme'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { MarketingBlockHighlight } from './MarketingBlockHighlight'

const meta: ComponentMeta<typeof MarketingBlockHighlight> = {
  title: 'features/home/MarketingBlock/MarketingBlockHighlight',
  component: MarketingBlockHighlight,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const variantConfig: Variants<typeof MarketingBlockHighlight> = [
  {
    label: 'MarketingBlockHighlight default',
    props: {
      title: 'Marathon Harry Potter dans tous les cinémas de France',
      homeId: 'homeId',
      moduleId: 'moduleId',
    },
  },
  {
    label: 'MarketingBlockHighlight with image',
    props: {
      title: 'Marathon Harry Potter dans tous les cinémas de France',
      homeId: 'homeId',
      moduleId: 'moduleId',
      backgroundImageUrl:
        'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW',
    },
  },
  {
    label: 'MarketingBlockHighlight with image and subtitle',
    props: {
      title: 'Marathon Harry Potter dans tous les cinémas de France',
      homeId: 'homeId',
      moduleId: 'moduleId',
      backgroundImageUrl:
        'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW',
      subtitle: 'Du 12/06 au 24/06',
    },
  },
  {
    label: 'MarketingBlockHighlight with image, subtitle and label',
    props: {
      title: 'Marathon Harry Potter dans tous les cinémas de France',
      homeId: 'homeId',
      moduleId: 'moduleId',
      backgroundImageUrl:
        'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW',
      subtitle: 'Du 12/06 au 24/06',
      label: 'Cinéma',
    },
  },
]

const Template: VariantsStory<typeof MarketingBlockHighlight> = () => (
  <VariantsTemplate variants={variantConfig} Component={MarketingBlockHighlight} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'MarketingBlockHighlight'
AllVariants.parameters = {
  chromatic: { viewports: [theme.breakpoints.xs, theme.breakpoints.xl] },
}
