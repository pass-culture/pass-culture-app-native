import { ComponentMeta } from '@storybook/react'
import React from 'react'

import { SubcategoryIdEnum, WithdrawalTypeEnum } from 'api/gen'
import { ThreeShapesTicket } from 'features/bookings/components/ThreeShapesTicket'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { OldTicketBody } from './OldTicketBody'

const meta: ComponentMeta<typeof OldTicketBody> = {
  title: 'features/bookings/OldTicketBody',
  component: OldTicketBody,
  parameters: {
    axe: {
      // Disabled this rule because we use SvgIdentifier for all Illustration linearGradient id
      disabledRules: ['duplicate-id'],
    },
  },
}
export default meta

const variantConfig: Variants<typeof OldTicketBody> = [
  {
    label: 'OldTicketBody default',
    props: {
      withdrawalDelay: 1000,
      withdrawalType: WithdrawalTypeEnum.on_site,
    },
  },
  {
    label: 'OldTicketBody external booking',
    props: {
      withdrawalDelay: 1000,
      externalBookings: { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' },
    },
  },
  {
    label: 'OldTicketBody with subcategory should have QR Code',
    props: {
      withdrawalDelay: 1000,
      qrCodeData: '1234',
      subcategoryId: SubcategoryIdEnum.ABO_BIBLIOTHEQUE,
    },
  },
  {
    label: 'OldTicketBody no ticket needed',
    props: { withdrawalDelay: 1000, withdrawalType: WithdrawalTypeEnum.no_ticket },
  },
  {
    label: 'OldTicketBody by email with beginning date',
    props: { withdrawalDelay: 1000, withdrawalType: WithdrawalTypeEnum.by_email },
  },
]

const Template: VariantsStory<typeof OldTicketBody> = () => (
  <ThreeShapesTicket>
    <VariantsTemplate variants={variantConfig} Component={OldTicketBody} />
  </ThreeShapesTicket>
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'OldTicketBody'
