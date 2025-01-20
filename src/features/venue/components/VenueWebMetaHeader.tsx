import React from 'react'

import { Helmet } from 'libs/react-helmet/Helmet'

import { description } from '../../../../package.json'

interface Props {
  title: string
  description?: string | null
}

export const VenueWebMetaHeader = (props: Props) => (
  <Helmet>
    <title>{props.title + ' | pass Culture'}</title>
    <meta name="title" content={props.title} />
    <meta name="description" content={props.description || description} />
  </Helmet>
)
