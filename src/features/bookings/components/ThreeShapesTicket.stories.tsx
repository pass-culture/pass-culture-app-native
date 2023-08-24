import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import QRCode from 'react-native-qrcode-svg'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'

import { ThreeShapesTicket } from './ThreeShapesTicket'

const meta: ComponentMeta<typeof ThreeShapesTicket> = {
  title: 'Features/bookings/ThreeShapesTicket',
  component: ThreeShapesTicket,
}
export default meta

const Template: ComponentStory<typeof ThreeShapesTicket> = (props) => (
  <ThreeShapesTicket {...props} />
)

export const Default = Template.bind({})
Default.args = {}

export const WithQRCode = Template.bind({})
WithQRCode.args = {
  children: <QRCode value="passculture" />,
}

export const WithButton = Template.bind({})
WithButton.args = {
  children: <ButtonPrimary wording="Accéder à l’offre" />,
}
