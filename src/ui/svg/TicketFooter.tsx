import React, { memo } from 'react'
import Svg, { Path, G, Stop, LinearGradient, Use } from 'react-native-svg'

// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

const ticketFooterRatio = 303 / 38
const viewBox = '0 0 303 38'

interface Props {
  width: number
  color?: ColorsEnum
}

function TicketFooterComponent(props: Props) {
  const height = props.width / ticketFooterRatio
  const color = props.color || ColorsEnum.WHITE
  const linearGradientId = 'ticket-footer-gradient'
  const pathId = 'ticket-footer-path'

  return (
    <Svg
      style={{ aspectRatio: ticketFooterRatio }}
      width={props.width}
      height={height}
      viewBox={viewBox}>
      <LinearGradient x1="0" y1="1" x2="0" y2="0" id={linearGradientId}>
        <Stop offset="0" stopColor={props.color} stopOpacity="1" />
        <Stop offset="1" stopColor={'#F0F0F0'} stopOpacity="1" />
      </LinearGradient>
      <G fill="none" fillRule="evenodd">
        <G fill={color}>
          <Path
            id={pathId}
            d="M121.004 329c.27 16.616 13.82 30 30.496 30 16.678 0 30.229-13.386 30.496-30H283c11.046 0 20 8.954 20 20l-.001 18H0v-18c0-11.046 8.954-20 20-20h101.004z"
            transform="translate(-36 -356) translate(36 27) matrix(1 0 0 -1 0 696)"
          />
          <Use fill={`url(#${linearGradientId})`} xlinkHref={`#${pathId}`} />
        </G>
      </G>
    </Svg>
  )
}

export const TicketFooter = memo(TicketFooterComponent)
