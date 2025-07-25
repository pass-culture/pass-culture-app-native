import React, { memo } from 'react'
import { Path } from 'react-native-svg'
import styled, { useTheme } from 'styled-components/native'

import { ColorsType } from 'theme/types'
import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

const ratio = 309 / 50
const viewBox = '0 0 309 50'

type Props = {
  width: number
  // eslint-disable-next-line react/no-unused-prop-types
  color?: ColorsType
}

const TicketFooterComponent: React.FC<Props> = (props) => {
  const height = props.width / ratio
  const { designSystem } = useTheme()

  return (
    <AccessibleSvg
      style={{
        aspectRatio: ratio,
        transform: [
          {
            rotate: '180deg',
          },
        ],
      }}
      width={props.width}
      height={height}
      viewBox={viewBox}>
      <Path
        d="M186.5,2c0,17.67-14.33,32-32,32s-32-14.33-32-32H26C12.75,2,2,12.75,2,26v24h305V26c0-13.25-10.75-24-24-24
		H186.5z"
        fill={designSystem.color.background.default}
      />
      <Path
        d="M283,2c13.25,0,24,10.75,24,24v24H2V26C2,12.75,12.75,2,26,2h96.5c0,17.67,14.33,32,32,32s32-14.33,32-32H283
		 M283,0h-96.5h-2v2c0,16.54-13.46,30-30,30s-30-13.46-30-30V0h-2H26C11.66,0,0,11.66,0,26v24l0,0h2h305h2l0,0V26
		C309,11.66,297.34,0,283,0L283,0z"
        fill={designSystem.color.background.locked}
      />
    </AccessibleSvg>
  )
}

export const TicketFooter = memo(
  styled(TicketFooterComponent).attrs(({ color, theme }) => ({
    color: color ?? theme.designSystem.color.background.locked,
  }))``
)
