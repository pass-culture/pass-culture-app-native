import React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { ColorsEnum, Typo } from 'ui/theme'

export const TitleWithCount: React.FC<{ title: string; count: number }> = ({
  count = 0,
  title,
}) => {
  const countString = `\xa0(${count})`
  return (
    <Typo.Title4>
      {title}
      {count > 0 && <RedTitle>{countString}</RedTitle>}
    </Typo.Title4>
  )
}

const RedTitle = styled(Text)({ color: ColorsEnum.PRIMARY })
