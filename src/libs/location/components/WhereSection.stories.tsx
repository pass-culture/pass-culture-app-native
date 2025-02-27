import { StoryObj, Meta } from '@storybook/react'
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
    (Story) => (
      <ReactQueryClientProvider>
        <Story />
      </ReactQueryClientProvider>
    ),
  ],
}
export default meta

const Template: StoryObj<typeof WhereSection> = (props) => <WhereSection {...props} />

// TODO(PC-17931): Fix this stories
const WithVenueBanner = Template.bind({})
WithVenueBanner.args = {
  venue: venueDataTest,
  locationCoordinates: { latitude: 2, longitude: 4 },
  address: mockedFullAddress,
  showVenueBanner: true,
}

// TODO(PC-17931): Fix this stories
const WithoutVenueBanner = Template.bind({})
WithoutVenueBanner.args = {
  venue: offerVenueResponseSnap,
  locationCoordinates: { latitude: 2, longitude: 4 },
  address: mockedFullAddress,
  showVenueBanner: false,
}
