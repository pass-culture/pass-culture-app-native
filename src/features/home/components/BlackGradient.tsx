import colorAlpha from 'color-alpha'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { TEXT_BACKGROUND_OPACITY } from 'features/home/components/constants'
import { getSpacing } from 'ui/theme'

const percentageRegex = /^\s*(100|(\d{1,2}([.,]\d+)?))\s*%$/

const isValidPercentage = (value: string): boolean => {
  if (!percentageRegex.test(value)) return false
  const numericValue = parseFloat(value.replace(',', '.'))
  return numericValue >= 0 && numericValue <= 100
}

const parseHeight = (height?: number | string): number | string => {
  const heightString = typeof height === 'string' && isValidPercentage(height)
  const heightNumber = typeof height === 'number'

  if (heightString || heightNumber) return height
  return getSpacing(8)
}

export const BlackGradient = styled(LinearGradient).attrs(({ theme }) => ({
  colors: [
    colorAlpha(theme.designSystem.color.background.lockedInverted, 0),
    colorAlpha(theme.designSystem.color.background.lockedInverted, TEXT_BACKGROUND_OPACITY),
  ],
}))<{ height?: number | string }>(({ height }) => ({
  height: parseHeight(height),
}))
