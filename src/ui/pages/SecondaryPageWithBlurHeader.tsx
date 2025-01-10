import React, { PropsWithChildren, ReactNode } from 'react'
import { ScrollViewProps } from 'react-native'
import styled from 'styled-components/native'

import { BlurHeader } from 'ui/components/headers/BlurHeader'
import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'

type Props = PropsWithChildren<{
  title: string
  shouldDisplayBackButton?: boolean
  onGoBack?: () => void
  RightButton?: ReactNode
  scrollable?: boolean
  scrollViewProps?: Omit<ScrollViewProps, 'contentContainerStyle'>
  noMaxWidth?: boolean
}>

export const SecondaryPageWithBlurHeader = ({
  title,
  shouldDisplayBackButton,
  onGoBack,
  RightButton,
  children,
  scrollable = true,
  scrollViewProps = {},
  noMaxWidth = false,
}: Props) => {
  const headerHeight = useGetHeaderHeight()

  return (
    <React.Fragment>
      <PageHeaderWithoutPlaceholder
        title={title}
        shouldDisplayBackButton={shouldDisplayBackButton}
        onGoBack={onGoBack}
        RightButton={RightButton}
      />
      <StyledScrollView {...scrollViewProps} scrollEnabled={scrollable} noMaxWidth={noMaxWidth}>
        <Placeholder height={headerHeight} />
        {children}
      </StyledScrollView>
      <BlurHeader height={headerHeight} />
    </React.Fragment>
  )
}

interface StyledScrollViewProps {
  noMaxWidth: boolean
}
const StyledScrollView = styled.ScrollView.attrs<StyledScrollViewProps>(
  ({ theme, noMaxWidth }) => ({
    contentContainerStyle: {
      paddingHorizontal: theme.contentPage.marginHorizontal,
      paddingVertical: theme.contentPage.marginVertical,
      maxWidth: noMaxWidth ? '100%' : theme.contentPage.maxWidth,
      width: '100%',
      alignSelf: 'center',
    },
  })
)<StyledScrollViewProps>({})

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))
