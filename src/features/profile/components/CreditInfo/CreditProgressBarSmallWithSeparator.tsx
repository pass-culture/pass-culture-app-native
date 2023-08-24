import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { CreditProgressBar } from 'features/profile/components/CreditInfo/CreditProgressBar'
import { getSpacing } from 'ui/theme'

interface Props {
  progress: '1/3' | '2/3' | '3/3' | '1/2' | '2/2'
}

export const CreditProgressBarSmallWithSeparator: React.FC<Props> = ({ progress }) => {
  const [numerator, denominator] = progress.split('/').map(Number)
  const progressInPercentage = (numerator / denominator) * 100
  const separatorWidthIncrement = 100 / denominator

  return (
    <View>
      <CreditProgressBar progress={progressInPercentage / 100} height="small" />
      {Array.from({ length: denominator }).map((_, index) => {
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
