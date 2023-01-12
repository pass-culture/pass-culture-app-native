import React from 'react'
import styled from 'styled-components/native'

import { plural } from 'libs/plural'
import { Typo } from 'ui/theme'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

const NON_BREAKING_SPACE = '\xa0'

export const TitleWithCount: React.FC<{
  title: string
  count: number
  ariaLive?: 'polite' | 'off'
  titleID?: string
}> = ({ count = 0, title, titleID, ariaLive = 'off' }) => {
  const countString = `${NON_BREAKING_SPACE}(${count})`
  const countLabel = plural(count, {
    one: '# sélectionné',
    other: '# sélectionnés',
  })
  return (
    <Title nativeID={titleID}>
      {title}
      {count > 0 && (
        <RedTitle
          accessibilityLabel={ariaLive === 'polite' ? countLabel : undefined}
          testID="titleCount"
          accessibilityLiveRegion={ariaLive}>
          {countString}
        </RedTitle>
      )}
    </Title>
  )
}

const Title = styled(Typo.ButtonText).attrs(getNoHeadingAttrs())``

const RedTitle = styled.Text(({ theme }) => ({
  color: theme.colors.primary,
}))
