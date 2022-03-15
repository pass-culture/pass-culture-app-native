import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import QRCode from 'react-native-qrcode-svg'

import { ThreeShapesTicket } from './ThreeShapesTicket'

export default {
  title: 'ui/Tickets/ThreeShapesTicket',
  component: ThreeShapesTicket,
} as ComponentMeta<typeof ThreeShapesTicket>

const Template: ComponentStory<typeof ThreeShapesTicket> = (props) => (
  <ThreeShapesTicket {...props} />
)

export const Default = Template.bind({})
Default.args = {}

export const WithQRCode = Template.bind({})
WithQRCode.args = {
  children: <QRCode value="passculture" />,
}
