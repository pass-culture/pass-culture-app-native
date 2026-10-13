import React, { FunctionComponent } from 'react'

import { useHandleHover } from 'libs/hooks/useHandleHover'

import { CinemaScreeningCardBase } from './CinemaScreeningCardBase'
import { CinemaScreeningCardComponentProps } from './types'

export const CinemaScreeningCard: FunctionComponent<CinemaScreeningCardComponentProps> = (
  props
) => {
  const hoverProps = useHandleHover()

  return (
    <CinemaScreeningCardBase
      {...props}
      hovered={hoverProps.isHover}
      onMouseEnter={hoverProps.onMouseEnter}
      onMouseLeave={hoverProps.onMouseLeave}
    />
  )
}
