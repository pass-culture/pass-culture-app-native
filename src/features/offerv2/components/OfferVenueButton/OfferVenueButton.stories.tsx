import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { OfferVenueButton } from 'features/offerv2/components/OfferVenueButton/OfferVenueButton'

const meta: ComponentMeta<typeof OfferVenueButton> = {
  title: 'features/offer/OfferVenueButton',
  component: OfferVenueButton,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const Template: ComponentStory<typeof OfferVenueButton> = (props) => <OfferVenueButton {...props} />

export const Default = Template.bind({})
Default.args = {
  venue: offerResponseSnap.venue,
}

export const WithoutSubtitle = Template.bind({})
WithoutSubtitle.args = {
  venue: { ...offerResponseSnap.venue, city: undefined },
}
