import React, { PropsWithChildren } from 'react'

import { ProfileContainer, ScrollableProfileContainer } from 'features/profile/components/reusables'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { Spacer } from 'ui/theme'

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
