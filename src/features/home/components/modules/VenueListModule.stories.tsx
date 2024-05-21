import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { venuesSearchFixture } from 'libs/algolia/fixtures/venuesSearchFixture'

import { VenueListModule } from './VenueListModule'

const meta: ComponentMeta<typeof VenueListModule> = {
  title: 'Features/Home/VenueListModule',
  component: VenueListModule,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const venues = [
  {
    ...venuesSearchFixture.hits[0],
    bannerUrl:
      'https://www.leparisien.fr/resizer/uxJNuMH2lV2yOvWxSs7JT-eTv9k=/arc-anglerfish-eu-central-1-prod-leparisien/public/JTVUQXKI3NAE7O7JILUC2UEZRQ.jpg',
  },
  {
    ...venuesSearchFixture.hits[1],
    bannerUrl:
      'https://www.inquirer.com/resizer/7CighwGfplhbYmaYFqMmazdcmEw=/arc-anglerfish-arc2-prod-pmn/public/44DHGZTDT5FB5BZGYIYZD4OYDU.jpg',
  },
]

const Template: ComponentStory<typeof VenueListModule> = (props) => <VenueListModule {...props} />
export const Default = Template.bind({})
Default.args = { venues }
