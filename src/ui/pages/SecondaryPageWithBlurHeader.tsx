import React, { PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { BlurHeader } from 'ui/components/headers/BlurHeader'
import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { getSpacing } from 'ui/theme'

type Props = PropsWithChildren<{
  headerTitle: string
  shouldDisplayBackButton?: boolean
}>

export const SecondaryPageWithBlurHeader = ({
  headerTitle,
  shouldDisplayBackButton,
  children,
}: Props) => {
  const headerHeight = useGetHeaderHeight()

  return (
    <React.Fragment>
      <PageHeaderWithoutPlaceholder
        title={headerTitle}
        shouldDisplayBackButton={shouldDisplayBackButton}
      />
      <StyledScrollView>
        <Placeholder height={headerHeight} />
        {children}
      </StyledScrollView>
      <BlurHeader height={headerHeight} />
    </React.Fragment>
  )
}

const StyledScrollView = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: {
    paddingHorizontal: getSpacing(6),
    maxWidth: theme.contentPage.maxWidth,
    width: '100%',
    alignSelf: 'center',
  },
}))``

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))
