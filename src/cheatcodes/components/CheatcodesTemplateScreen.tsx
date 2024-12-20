import React, { PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { Spacer } from 'ui/theme'

type Props = PropsWithChildren<{
  title: string
  flexDirection?: 'row' | 'column'
}>

export const CheatcodesTemplateScreen: React.FC<Props> = ({
  title,
  flexDirection = 'row',
  children,
}) => {
  const headerHeight = useGetHeaderHeight()

  return (
    <React.Fragment>
      <PageHeaderWithoutPlaceholder title={title} />
      <Placeholder height={headerHeight} />
      <ScrollView>
        <StyledContainer flexDirection={flexDirection}>{children}</StyledContainer>
        <Spacer.BottomScreen />
      </ScrollView>
    </React.Fragment>
  )
}

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
  backgroundColor: 'white',
}))

const ScrollView = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: {
    backgroundColor: theme.colors.white,
  },
}))``

const StyledContainer = styled.View<{ flexDirection: 'row' | 'column' }>(
  ({ theme, flexDirection }) => ({
    flexDirection,
    flexWrap: flexDirection === 'row' ? 'wrap' : 'nowrap',
    paddingVertical: theme.contentPage.marginVertical,
    paddingHorizontal: theme.contentPage.marginHorizontal,
  })
)
