import { ComponentMeta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { SubcategoryIdEnum, WithdrawalTypeEnum } from 'api/gen'
import { TicketBody as OldTicketBody } from 'features/bookings/components/OldTicketBody/TicketBody'
import { TicketBody } from 'features/bookings/components/TicketBody/TicketBody'
import { TicketCutout } from 'features/bookings/components/TicketCutout'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { VenueBlock } from 'features/offer/components/OfferVenueBlock/VenueBlock'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { IdCard } from 'ui/svg/icons/IdCard'
import { Typo } from 'ui/theme'

const meta: ComponentMeta<typeof TicketCutout> = {
  title: 'Features/bookings/TicketCutout',
  component: TicketCutout,
  parameters: {
    axe: {
      // Disabled this rule because we use the same icon IdCard for multiple variants
      disabledRules: ['duplicate-id'],
    },
  },
}
export default meta

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const variantConfig: Variants<typeof TicketCutout> = [
  {
    label: 'TicketCutout external booking',
    props: {
      title: offerResponseSnap.name,
      hour: '18h30',
      day: '20 fev. 2025',
      isDuo: true,
      infoBanner: (
        <InfoBanner
          message="Tu auras besoin de ta carte d’identité pour accéder à l’évènement."
          icon={IdCard}
        />
      ),
      children: (
        <ViewGap gap={6}>
          <OldTicketBody
            withdrawalType={WithdrawalTypeEnum.in_app}
            withdrawalDelay={1000}
            beginningDatetime={undefined}
            subcategoryId={SubcategoryIdEnum.CONCERT}
            qrCodeData={undefined}
            externalBookings={{ barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' }}
            venue={bookingsSnap.ongoing_bookings[0].stock.offer.venue}
          />
          <StyledBody>Présente ce billet pour accéder à l’évènement</StyledBody>
        </ViewGap>
      ),
      venueInfo: <VenueBlock venueId={bookingsSnap.ongoing_bookings[0].stock.offer.venue.id} />,
    },
  },
  {
    label: 'TicketBody no ticket needed',
    props: {
      title: offerResponseSnap.name,
      hour: '18h30',
      day: '20 fev. 2025',
      isDuo: true,
      infoBanner: (
        <InfoBanner
          message="Tu auras besoin de ta carte d’identité pour accéder à l’évènement."
          icon={IdCard}
        />
      ),
      children: <TicketBody withdrawalType={WithdrawalTypeEnum.no_ticket} />,
      venueInfo: <VenueBlock venueId={bookingsSnap.ongoing_bookings[0].stock.offer.venue.id} />,
    },
  },
]

const Template: VariantsStory<typeof TicketCutout> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={TicketCutout} defaultProps={args} />
)

// Todo(PC-35079) fix this story, read the associated ticket to follow the different choices offered
const AllVariants = Template.bind({})
AllVariants.storyName = 'TicketCutout'
