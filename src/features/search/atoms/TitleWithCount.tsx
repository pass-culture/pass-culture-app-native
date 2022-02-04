import React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'
const NON_BREAKING_SPACE = '\xa0'

export const TitleWithCount: React.FC<{ title: string; count: number }> = ({
  count = 0,
  title,
}) => {
  const countString = `${NON_BREAKING_SPACE}(${count})`
  return (
    <Title>
      {title}
      {count > 0 && <RedTitle>{countString}</RedTitle>}
    </Title>
  )
}

const Title = styled(Typo.Title4).attrs({ accessibilityRole: 'none', 'aria-level': undefined })``
const RedTitle = styled(Text)(({ theme }) => ({ color: theme.colors.primary }))
