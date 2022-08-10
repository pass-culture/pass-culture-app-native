import React, { PropsWithChildren } from 'react'

import { ProfileContainer } from 'features/profile/components/reusables'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { Spacer } from 'ui/theme'

type Props = PropsWithChildren<{
  title: string
}>

export function PageProfileSection({ title, children }: Props) {
  return (
    <React.Fragment>
      <PageHeader title={title} background="primary" withGoBackButton />
      <ProfileContainer>
        <Spacer.Column numberOfSpaces={6} />
        {children}
        <Spacer.Column numberOfSpaces={6} />
      </ProfileContainer>
    </React.Fragment>
  )
}
