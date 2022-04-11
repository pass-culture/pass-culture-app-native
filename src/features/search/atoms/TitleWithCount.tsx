import { plural } from '@lingui/macro'
import React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typography'
const NON_BREAKING_SPACE = '\xa0'

export const TitleWithCount: React.FC<{
  title: string
  count: number
  ariaLive?: 'polite' | 'off'
}> = ({ count = 0, title, ariaLive = 'off' }) => {
  const countString = `${NON_BREAKING_SPACE}(${count})`
  const countLabel = plural(count, {
    one: '# sélectionné',
    other: '# sélectionnés',
  })
  return (
    <Title>
      {title}
      {count > 0 && (
        <RedTitle
          accessibilityLabel={ariaLive === 'polite' ? countLabel : undefined}
          testID="titleCount"
          aria-live={ariaLive}>
          {countString}
        </RedTitle>
      )}
    </Title>
  )
}

const Title = styled(Typo.Title4).attrs(getHeadingAttrs())``
const RedTitle = styled(Text)(({ theme }) => ({ color: theme.colors.primary }))
