import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import QRCode from 'react-native-qrcode-svg'

import { Button } from 'ui/designSystem/Button/Button'
import { VariantsTemplate, type Variants } from 'ui/storybook/VariantsTemplate'

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
    props: { children: <Button wording="Accéder à l’offre" fullWidth /> },
  },
]

type Story = StoryObj<typeof ThreeShapesTicket>

export const AllVariants: Story = {
  name: 'ThreeShapesTicket',
  render: (args: React.ComponentProps<typeof ThreeShapesTicket>) => (
    <VariantsTemplate variants={variantConfig} Component={ThreeShapesTicket} defaultProps={args} />
  ),
}
