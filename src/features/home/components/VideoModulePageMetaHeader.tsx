import React from 'react'

import { Helmet } from 'libs/react-helmet/Helmet'

type Props = {
  title: string
}

export const VideoModulePageMetaHeader = ({ title }: Props) => (
  <Helmet>
    <title>{title + ' | pass Culture'}</title>
    <meta name="title" content={title} />
    <meta name="description" content={title} />
  </Helmet>
)
