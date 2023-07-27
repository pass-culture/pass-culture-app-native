import React, { PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { ProfileContainer } from 'features/profile/components/PageProfileSection/ProfileContainer'
import { BlurHeader } from 'ui/components/headers/BlurHeader'
import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { getSpacing, Spacer } from 'ui/theme'

type Props = PropsWithChildren<{
  title: string
  scrollable?: boolean
}>

export function PageProfileSection({ title, scrollable = false, children }: Props) {
  const Container: React.JSXElementConstructor<PropsWithChildren> = scrollable
    ? ScrollableProfileContainer
    : ProfileContainer

  const headerHeight = useGetHeaderHeight()

  return (
    <React.Fragment>
      <PageHeaderWithoutPlaceholder title={title} />
      <Container>
        <Placeholder height={headerHeight} />
        <Spacer.Column numberOfSpaces={6} />
        {children}
        <Spacer.Column numberOfSpaces={6} />
      </Container>
      <BlurHeader height={headerHeight} />
    </React.Fragment>
  )
}

const ScrollableProfileContainer = styled.ScrollView(({ theme }) => ({
  flex: 1,
  flexDirection: 'column',
  backgroundColor: theme.colors.white,
  paddingHorizontal: getSpacing(6),
}))

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))
