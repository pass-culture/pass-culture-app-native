import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { SubcategoryIdEnum, WithdrawalTypeEnum } from 'api/gen'
import { ThreeShapesTicket } from 'features/bookings/components/ThreeShapesTicket'

import { TicketBody } from './TicketBody'

const meta: ComponentMeta<typeof TicketBody> = {
  title: 'features/bookings/TicketBody',
  component: TicketBody,
  parameters: {
    axe: {
      // Disabled this rule because we use SvgIdentifier for all Illustration linearGradient id
      disabledRules: ['duplicate-id'],
    },
  },
}
export default meta

const Template: ComponentStory<typeof TicketBody> = (props) => (
  <ThreeShapesTicket>
    <TicketBody {...props} />
  </ThreeShapesTicket>
)

export const Default = Template.bind({})
Default.args = {
  withdrawalDelay: 1000,
  withdrawalType: WithdrawalTypeEnum.on_site,
}

export const ExternalBookings = Template.bind({})
ExternalBookings.args = {
  withdrawalDelay: 1000,
  externalBookings: { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' },
}

export const SubcategoryShouldHaveQrCode = Template.bind({})
SubcategoryShouldHaveQrCode.args = {
  withdrawalDelay: 1000,
  qrCodeData: '1234',
  subcategoryId: SubcategoryIdEnum.ABO_BIBLIOTHEQUE,
}

export const NoTicketNeeded = Template.bind({})
NoTicketNeeded.args = {
  withdrawalDelay: 1000,
  withdrawalType: WithdrawalTypeEnum.no_ticket,
}

export const ByEmailWithBeginningDate = Template.bind({})
ByEmailWithBeginningDate.args = {
  withdrawalDelay: 1000,
  withdrawalType: WithdrawalTypeEnum.by_email,
}
