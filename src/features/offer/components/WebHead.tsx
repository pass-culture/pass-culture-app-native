import React from 'react'

import { Helmet } from 'libs/react-helmet/Helmet'

import { description as defaultDescription } from '../../../../package.json'

interface Props {
  title: string
  description?: string
}

export const WebHead = ({ title, description }: Props) => (
  <Helmet>
    <title>{title + ' | pass Culture'}</title>
    <meta name="title" content={title} />
    <meta name="description" content={description ?? defaultDescription} />
  </Helmet>
)
