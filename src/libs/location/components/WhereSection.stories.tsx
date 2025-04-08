import { NavigationContainer } from '@react-navigation/native'
import type { Meta } from '@storybook/react'
import React from 'react'

import { offerVenueResponseSnap } from 'features/offer/fixtures/offerVenueReponse'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { mockedFullAddress } from 'libs/address/fixtures/mockedFormatFullAddress'
import { ReactQueryClientProvider } from 'libs/react-query/ReactQueryClientProvider'
import { Variants, VariantsStory, VariantsTemplate } from 'ui/storybook/VariantsTemplate'

import { WhereSection } from './WhereSection'

const meta: Meta<typeof WhereSection> = {
  title: 'ui/WhereSection',
  component: WhereSection,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <ReactQueryClientProvider>
          <Story />
        </ReactQueryClientProvider>
      </NavigationContainer>
    ),
  ],
}
export default meta

const variantConfig: Variants<typeof WhereSection> = [
  {
    label: 'WhereSection WithoutVenueBanner',
    props: {
      venue: offerVenueResponseSnap,
      locationCoordinates: { latitude: 2, longitude: 4 },
      address: mockedFullAddress,
      showVenueBanner: false,
    },
  },
  {
    label: 'WhereSection WithVenueBanner',
    props: {
      venue: venueDataTest,
      locationCoordinates: { latitude: 2, longitude: 4 },
      address: mockedFullAddress,
      showVenueBanner: true,
    },
  },
]

export const Template: VariantsStory<typeof WhereSection> = {
  name: 'WhereSection',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={WhereSection} defaultProps={props} />
  ),
}
