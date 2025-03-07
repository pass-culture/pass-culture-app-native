import { NavigationContainer } from '@react-navigation/native'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { venuesSearchFixture } from 'libs/algolia/fixtures/venuesSearchFixture'
import { VariantsTemplate, type Variants } from 'ui/storybook/VariantsTemplate'

import { VenueListModule } from './VenueListModule'

const meta: Meta<typeof VenueListModule> = {
  title: 'Features/Home/VenueListModule',
  component: VenueListModule,
  decorators: [
    (Story: React.ComponentType) => (
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

const variantConfig: Variants<typeof VenueListModule> = [
  {
    label: 'VenueListModule',
    props: {
      venues,
    },
  },
]

type Story = StoryObj<typeof VenueListModule>

const Template = (args: React.ComponentProps<typeof VenueListModule>) => (
  <VariantsTemplate variants={variantConfig} Component={VenueListModule} defaultProps={args} />
)

export const AllVariants: Story = {
  render: Template,
}
