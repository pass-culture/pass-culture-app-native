import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { CreditProgressBar } from 'features/profile/components/CreditInfo/CreditProgressBar'
import { getSpacing } from 'ui/theme'

interface Props {
  currentStep: number
  totalStep: number
}

export const CreditBarWithSeparator: React.FC<Props> = ({ currentStep, totalStep }) => {
  const progressInPercentage = (currentStep / totalStep) * 100
  const separatorWidthIncrement = 100 / totalStep

  return (
    <View>
      <CreditProgressBar progress={progressInPercentage / 100} height="small" />
      {Array.from({ length: totalStep }).map((_, index) => {
        const separatorWidth = separatorWidthIncrement * (index + 1)
        return <Separator width={separatorWidth} key={separatorWidth} />
      })}
    </View>
  )
}

const Separator = styled.View<{ width: number }>(({ theme, width }) => ({
  borderRadius: getSpacing(2),
  height: getSpacing(2),
  width: `${width}%`,
  outlineColor: theme.colors.white,
  outlineStyle: theme.outline.style,
  outlineWidth: theme.outline.width,
  position: 'absolute',
  left: 0,
}))
