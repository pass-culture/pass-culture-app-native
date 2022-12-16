import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { offerVenueResponseSnap } from 'features/offer/fixtures/offerVenueReponse'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { mockedFullAddress } from 'libs/address/fixtures/mockedFormatFullAddress'
import { ReactQueryClientProvider } from 'libs/react-query/ReactQueryClientProvider'

import { WhereSection } from './WhereSection'

export default {
  title: 'ui/tutu',
  component: WhereSection,
  decorators: [
    (Story) => (
      <ReactQueryClientProvider>
        <Story />
      </ReactQueryClientProvider>
    ),
  ],
} as ComponentMeta<typeof WhereSection>

const Template: ComponentStory<typeof WhereSection> = (props) => <WhereSection {...props} />

// TODO(PC-17931): Fix this stories
const WithVenueBanner = Template.bind({})
WithVenueBanner.args = {
  venue: venueResponseSnap,
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
