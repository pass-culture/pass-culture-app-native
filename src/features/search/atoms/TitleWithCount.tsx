import React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'
import { ColorsEnum } from 'ui/theme/colors'
const NON_BREAKING_SPACE = '\xa0'

export const TitleWithCount: React.FC<{ title: string; count: number }> = ({
  count = 0,
  title,
}) => {
  const countString = `${NON_BREAKING_SPACE}(${count})`
  return (
    <Typo.Title4>
      {title}
      {count > 0 && <RedTitle>{countString}</RedTitle>}
    </Typo.Title4>
  )
}

const RedTitle = styled(Text)({ color: ColorsEnum.PRIMARY })
