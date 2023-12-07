import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { SnackBarProvider } from 'ui/components/snackBar/SnackBarContext'

import { OfferVenueBlock } from './OfferVenueBlock'

const meta: ComponentMeta<typeof OfferVenueBlock> = {
  title: 'features/offer/OfferVenueBlock',
  component: OfferVenueBlock,
  decorators: [
    (Story) => (
      <SnackBarProvider>
        <Story />
      </SnackBarProvider>
    ),
  ],
}
export default meta

const Template: ComponentStory<typeof OfferVenueBlock> = (props) => <OfferVenueBlock {...props} />

export const Default = Template.bind({})
Default.args = {
  title: 'Lieu de retrait',
  venue: offerResponseSnap.venue,
  distance: '1,1 km',
}

export const AsEvent = Template.bind({})
AsEvent.args = {
  ...Default.args,
  title: 'Lieu de l’événement',
  onChangeVenuePress: undefined,
}

export const AsEventWithoutDistance = Template.bind({})
AsEventWithoutDistance.args = {
  ...AsEvent.args,
  distance: undefined,
}
