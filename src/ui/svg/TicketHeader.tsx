import React, { memo } from 'react'
import Svg, { Path } from 'react-native-svg'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

const ratio = 309 / 50
const viewBox = '0 0 309 50'

interface Props {
  width: number
  color?: ColorsEnum
}

function TicketHeaderComponent(props: Props) {
  const theme = useTheme()
  const height = props.width / ratio
  return (
    <Svg style={{ aspectRatio: ratio }} width={props.width} height={height} viewBox={viewBox}>
      <Path
        d="M186.5,2c0,17.67-14.33,32-32,32s-32-14.33-32-32H26C12.75,2,2,12.75,2,26v24h305V26c0-13.25-10.75-24-24-24
		H186.5z"
        fill={theme.colors.white}
      />
      <Path
        d="M283,2c13.25,0,24,10.75,24,24v24H2V26C2,12.75,12.75,2,26,2h96.5c0,17.67,14.33,32,32,32s32-14.33,32-32H283
		 M283,0h-96.5h-2v2c0,16.54-13.46,30-30,30s-30-13.46-30-30V0h-2H26C11.66,0,0,11.66,0,26v24l0,0h2h305h2l0,0V26
		C309,11.66,297.34,0,283,0L283,0z"
        fill={theme.colors.greyLight}
      />
    </Svg>
  )
}

export const TicketHeader = memo(
  styled(TicketHeaderComponent).attrs(({ color, theme }) => ({
    color: color ?? theme.colors.white,
  }))``
)
