import { NavigationContainer } from '@react-navigation/native'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { offerVenueResponseSnap } from 'features/offer/fixtures/offerVenueReponse'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { mockedFullAddress } from 'libs/address/fixtures/mockedFormatFullAddress'
import { ReactQueryClientProvider } from 'libs/react-query/ReactQueryClientProvider'

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

type Story = StoryObj<typeof WhereSection>

export const WithVenueBanner: Story = {
  render: (props) => <WhereSection {...props} />,
  args: {
    venue: venueDataTest,
    locationCoordinates: { latitude: 2, longitude: 4 },
    address: mockedFullAddress,
    showVenueBanner: true,
  },
}

export const WithoutVenueBanner: Story = {
  render: (props) => <WhereSection {...props} />,
  args: {
    venue: offerVenueResponseSnap,
    locationCoordinates: { latitude: 2, longitude: 4 },
    address: mockedFullAddress,
    showVenueBanner: false,
  },
}
