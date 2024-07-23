import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { offerVenueResponseSnap } from 'features/offer/fixtures/offerVenueReponse'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { mockedFullAddress } from 'libs/address/fixtures/mockedFormatFullAddress'

import { WhereSection } from './WhereSection'

const meta: ComponentMeta<typeof WhereSection> = {
  title: 'ui/WhereSection',
  component: WhereSection,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const Template: ComponentStory<typeof WhereSection> = (props) => <WhereSection {...props} />

export const WithVenueBanner = Template.bind({})
WithVenueBanner.args = {
  venue: venueDataTest,
  locationCoordinates: { latitude: 2, longitude: 4 },
  address: mockedFullAddress,
  showVenueBanner: true,
}

export const WithoutVenueBanner = Template.bind({})
WithoutVenueBanner.args = {
  venue: offerVenueResponseSnap,
  locationCoordinates: { latitude: 2, longitude: 4 },
  address: mockedFullAddress,
  showVenueBanner: false,
}
