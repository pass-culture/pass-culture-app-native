import { ComponentMeta } from '@storybook/react'
import React from 'react'

import { TicketCutout } from 'features/bookings/components/TicketCutout'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { IdCard } from 'ui/svg/icons/IdCard'

const meta: ComponentMeta<typeof TicketCutout> = {
  title: 'Features/bookings/TicketCutout',
  component: TicketCutout,
}
export default meta

const variantConfig: Variants<typeof TicketCutout> = [
  {
    label: 'TicketCutout default',
    props: {
      title: offerResponseSnap.name,
      hour: '18h30',
      day: '20 fev. 2025',
      isDuo: true,
      shouldDisplayItineraryButton: false,
      offerFullAddress: '120 Blvd Marguerite de Rochechouart, 75018 Paris',
      venue: bookingsSnap.ongoing_bookings[0].stock.offer.venue,
      address: bookingsSnap.ongoing_bookings[0].stock.offer.address,
      offerId: 2,
      infoBanner: (
        <InfoBanner
          message="Tu auras besoin de ta carte d’identité pour accéder à l’évènement."
          icon={IdCard}
        />
      ),
      children: <React.Fragment />,
      venuInfo: (
        <VenueBlockWithItinerary
          shouldDisplayItineraryButton={shouldDisplayItineraryButton}
          offerFullAddress={offerFullAddress}
          venue={venue}
          address={address}
          offerId={offerId}
          thumbnailSize={VENUE_THUMBNAIL_SIZE}
        />
      ),
    },
  },
]

const Template: VariantsStory<typeof TicketCutout> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={TicketCutout} defaultProps={args} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'TicketCutout'
