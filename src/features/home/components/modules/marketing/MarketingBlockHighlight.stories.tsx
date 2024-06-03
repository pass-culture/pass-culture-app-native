import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

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

const Template: ComponentStory<typeof MarketingBlockHighlight> = (props) => (
  <MarketingBlockHighlight {...props} />
)

export const Default = Template.bind({})
Default.args = {
  title: 'Marathon Harry Potter dans tous les cinémas de France',
  backgroundImageUrl:
    'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW',
  categoryText: 'Cinéma',
  date: 'Du 12/06 au 24/06',
  homeId: 'homeId',
  moduleId: 'moduleId',
}

export const WithoutBackgroundImage = Template.bind({})
WithoutBackgroundImage.args = {
  title: 'Marathon Harry Potter dans tous les cinémas de France',
  categoryText: 'Cinéma',
  date: 'Du 12/06 au 24/06',
  homeId: 'homeId',
  moduleId: 'moduleId',
}
