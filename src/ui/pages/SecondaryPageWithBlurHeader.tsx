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
  enableMaxWidth?: boolean
}>

export const SecondaryPageWithBlurHeader = ({
  title,
  shouldDisplayBackButton,
  onGoBack,
  RightButton,
  children,
  scrollable = true,
  scrollViewProps = {},
  enableMaxWidth = true,
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
      <StyledScrollView
        {...scrollViewProps}
        scrollEnabled={scrollable}
        enableMaxWidth={enableMaxWidth}>
        <Placeholder height={headerHeight} />
        {children}
      </StyledScrollView>
      <BlurHeader height={headerHeight} />
    </React.Fragment>
  )
}

interface StyledScrollViewProps {
  enableMaxWidth: boolean
}
const StyledScrollView = styled.ScrollView.attrs<StyledScrollViewProps>(
  ({ theme, enableMaxWidth }) => ({
    contentContainerStyle: {
      paddingHorizontal: theme.contentPage.marginHorizontal,
      paddingVertical: theme.contentPage.marginVertical,
      maxWidth: enableMaxWidth ? theme.contentPage.maxWidth : '100%',
      width: '100%',
      alignSelf: 'center',
    },
  })
)<StyledScrollViewProps>({})

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))
