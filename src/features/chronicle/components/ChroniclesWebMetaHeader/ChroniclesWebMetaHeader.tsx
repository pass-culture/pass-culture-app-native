import React from 'react'

import { Helmet } from 'libs/react-helmet/Helmet'

import { description } from '../../../../../package.json'

interface Props {
  title: string
}

export const ChroniclesWebMetaHeader = ({ title }: Props) => {
  return (
    <Helmet>
      <title>{title + ' | pass Culture'}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
    </Helmet>
  )
}
