import React, { PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { ProfileContainer } from 'features/profile/components/PageProfileSection/ProfileContainer'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { getSpacing, Spacer } from 'ui/theme'

type Props = PropsWithChildren<{
  title: string
  scrollable?: boolean
}>

export function PageProfileSection({ title, scrollable = false, children }: Props) {
  const Container: React.FC = scrollable ? ScrollableProfileContainer : ProfileContainer
  return (
    <React.Fragment>
      <PageHeaderSecondary title={title} />
      <Container>
        <Spacer.Column numberOfSpaces={6} />
        {children}
        <Spacer.Column numberOfSpaces={6} />
      </Container>
    </React.Fragment>
  )
}

const ScrollableProfileContainer = styled.ScrollView(({ theme }) => ({
  flex: 1,
  flexDirection: 'column',
  backgroundColor: theme.colors.white,
  paddingHorizontal: getSpacing(6),
}))
