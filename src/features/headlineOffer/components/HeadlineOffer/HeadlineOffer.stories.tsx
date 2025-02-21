import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta } from '@storybook/react'
import React from 'react'

import { HeadlineOffer } from 'features/headlineOffer/components/HeadlineOffer/HeadlineOffer'
import { SHARE_APP_IMAGE_SOURCE } from 'features/share/components/shareAppImage'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

const meta: ComponentMeta<typeof HeadlineOffer> = {
  title: 'ui/HeadlineOffer',
  component: HeadlineOffer,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const variantConfig: Variants<typeof HeadlineOffer> = [
  {
    label: 'HeadlineOffer default',
    props: {
      navigateTo: { screen: 'Offer' },
      category: 'Livre',
      offerTitle: 'One Piece Tome 108',
      imageUrl: SHARE_APP_IMAGE_SOURCE,
      price: '7,20€',
      distance: '500m',
    },
  },
]

const Template: VariantsStory<typeof HeadlineOffer> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={HeadlineOffer} defaultProps={args} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'HeadlineOffer'
