import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import QRCode from 'react-native-qrcode-svg'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'

import { ThreeShapesTicket } from './ThreeShapesTicket'

const meta: ComponentMeta<typeof ThreeShapesTicket> = {
  title: 'Features/bookings/ThreeShapesTicket',
  component: ThreeShapesTicket,
}
export default meta

const variantConfig = [
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

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={ThreeShapesTicket} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'ThreeShapesTicket'
