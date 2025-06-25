import React, { PropsWithChildren } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { Page } from 'ui/pages/Page'
import { Spacer } from 'ui/theme'

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
  const headerHeight = useGetHeaderHeight()

  return (
    <Page>
      <PageHeaderWithoutPlaceholder title={title} onGoBack={onGoBack} />
      <Placeholder height={headerHeight} />
      <ScrollView>
        <StyledContainer flexDirection={flexDirection}>{children}</StyledContainer>
        <Spacer.BottomScreen />
      </ScrollView>
    </Page>
  )
}

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))

const StyledContainer = styled.View<{ flexDirection: 'row' | 'column' }>(
  ({ theme, flexDirection }) => ({
    flexDirection,
    flexWrap: flexDirection === 'row' ? 'wrap' : 'nowrap',
    paddingVertical: theme.contentPage.marginVertical,
    paddingHorizontal: theme.contentPage.marginHorizontal,
  })
)
