import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { offerVenueResponseSnap } from 'features/offer/fixtures/offerVenueReponse'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { mockedFullAddress } from 'libs/address/fixtures/mockedFormatFullAddress'
import { ReactQueryClientProvider } from 'libs/react-query/ReactQueryClientProvider'

import { WhereSection } from './WhereSection'

const meta: Meta<typeof WhereSection> = {
  title: 'ui/tutu',
  component: WhereSection,
  decorators: [
    (Story: React.ComponentType) => (
      <ReactQueryClientProvider>
        <Story />
      </ReactQueryClientProvider>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof WhereSection>

// TODO(PC-17931): Fix this stories
export const WithVenueBanner: Story = {
  render: (props) => <WhereSection {...props} />,
  args: {
    venue: venueDataTest,
    locationCoordinates: { latitude: 2, longitude: 4 },
    address: mockedFullAddress,
    showVenueBanner: true,
  },
}

// TODO(PC-17931): Fix this stories
export const WithoutVenueBanner: Story = {
  render: (props) => <WhereSection {...props} />,
  args: {
    venue: offerVenueResponseSnap,
    locationCoordinates: { latitude: 2, longitude: 4 },
    address: mockedFullAddress,
    showVenueBanner: false,
  },
}
