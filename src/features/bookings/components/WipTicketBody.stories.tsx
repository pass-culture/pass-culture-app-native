import { ComponentMeta } from '@storybook/react'
import React from 'react'
import QRCode from 'react-native-qrcode-svg'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { WipTicketBody } from './WipTicketBody'

const meta: ComponentMeta<typeof WipTicketBody> = {
  title: 'Features/bookings/WipTicketBody',
  component: WipTicketBody,
}
export default meta

const variantConfig: Variants<typeof WipTicketBody> = [
  {
    label: 'WipTicketBody default',
    props: {
      bottomChildren: <QRCode value="passculture" />,
      title: 'Angèle en concert',
      date: '20 février 2025',
      hour: '18h30',
      duo: true,
      venueTitle: 'La Cigale',
      venueAdress: '120 Blvd Marguerite de Rochechouart, 75018 Paris',
      venueImageURL:
        'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/krists-luhaers-AtPWnYNDJnM-unsplash.png',
    },
  },
]

const Template: VariantsStory<typeof WipTicketBody> = () => (
  <VariantsTemplate variants={variantConfig} Component={WipTicketBody} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'WipTicketBody'
