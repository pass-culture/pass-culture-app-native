import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { theme } from 'theme'
import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'

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

const variantConfig = [
  {
    label: 'MarketingBlockHighlight default',
    props: {
      title: 'Marathon Harry Potter dans tous les cinémas de France',
      backgroundImageUrl:
        'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW',
      subtitle: 'Du 12/06 au 24/06',
      homeId: 'homeId',
      moduleId: 'moduleId',
    },
  },
  {
    label: 'MarketingBlockHighlight without image',
    props: {
      title: 'Marathon Harry Potter dans tous les cinémas de France',
      subtitle: 'Du 12/06 au 24/06',
      homeId: 'homeId',
      moduleId: 'moduleId',
    },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={MarketingBlockHighlight} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'MarketingBlockHighlight'
AllVariants.parameters = {
  chromatic: { viewports: [theme.breakpoints.xs, theme.breakpoints.xl] },
}
