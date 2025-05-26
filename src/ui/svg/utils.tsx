import React from 'react'
import { Defs, LinearGradient, Stop } from 'react-native-svg'
import { v1 as uuidv1 } from 'uuid'

import { ColorsTypeLegacy } from 'theme/types'

export const svgIdentifier = (prefix?: string, suffix?: string) => {
  const uuid = uuidv1()
  const p = prefix || 'gradient'
  const s = suffix || ''
  const id = `${p}${uuid}${s}`
  const xlinkHref = `#${id}`
  const fill = `url(${xlinkHref})`
  return {
    id,
    xlinkHref,
    fill,
  }
}

interface BicolorGradientProps {
  id: string
  color1: ColorsTypeLegacy
  color2: ColorsTypeLegacy
}

export const BicolorGradient = ({ id, color1, color2 }: BicolorGradientProps) => (
  <Defs>
    <LinearGradient id={id} x1="16.056%" x2="83.944%" y1="0%" y2="100%">
      <Stop offset="0%" stopColor={color1} />
      <Stop offset="100%" stopColor={color2} />
    </LinearGradient>
  </Defs>
)
