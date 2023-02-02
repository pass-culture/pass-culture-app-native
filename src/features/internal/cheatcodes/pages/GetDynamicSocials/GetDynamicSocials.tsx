import React, { FunctionComponent } from 'react'

import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'

interface Props {
  children?: never
}

export const GetDynamicSocials: FunctionComponent<Props> = () => {
  return (
    <React.Fragment>
      <PageHeaderSecondary title="Spike réseaux sociaux dynamiques" />
    </React.Fragment>
  )
}
