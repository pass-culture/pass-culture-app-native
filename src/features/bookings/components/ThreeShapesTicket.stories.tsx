import { Meta } from '@storybook/react'
import React from 'react'
import QRCode from 'react-native-qrcode-svg'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { ThreeShapesTicket } from './ThreeShapesTicket'

const meta: Meta<typeof ThreeShapesTicket> = {
  title: 'Features/bookings/ThreeShapesTicket',
  component: ThreeShapesTicket,
}
export default meta

const variantConfig: Variants<typeof ThreeShapesTicket> = [
  {
    label: 'ThreeShapesTicket default',
    props: {},
  },
  {
    label: 'ThreeShapesTicket with QR Code',
    props: { children: <QRCode value="passculture" /> },
  },
  {
    label: 'ThreeShapesTicket with button',
    props: { children: <ButtonPrimary wording="Accéder à l’offre" /> },
  },
]

const Template: VariantsStory<typeof ThreeShapesTicket> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={ThreeShapesTicket} defaultProps={args} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'ThreeShapesTicket'
