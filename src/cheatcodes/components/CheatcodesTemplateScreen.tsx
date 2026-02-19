import React, { PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { PageWithHeader } from 'ui/pages/PageWithHeader'

type Props = PropsWithChildren<{
  title: string
  flexDirection?: 'row' | 'column'
  onGoBack?: () => void
}>

export const CheatcodesTemplateScreen: React.FC<Props> = ({
  title,
  flexDirection = 'row',
  children,
  onGoBack,
}) => {
  return (
    <PageWithHeader
      title={title}
      onGoBack={onGoBack}
      scrollChildren={<StyledContainer flexDirection={flexDirection}>{children}</StyledContainer>}
    />
  )
}

const StyledContainer = styled.View<{ flexDirection: 'row' | 'column' }>(({ flexDirection }) => ({
  flexDirection,
  flexWrap: flexDirection === 'row' ? 'wrap' : 'nowrap',
}))
