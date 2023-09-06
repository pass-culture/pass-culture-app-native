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
  height: getSpacing(3),
  width: `${width}%`,
  borderColor: theme.colors.white,
  borderWidth: getSpacing(0.5),
  position: 'absolute',
  left: 0,
  top: -2,
  zIndex: theme.zIndex.progressbar,
}))
